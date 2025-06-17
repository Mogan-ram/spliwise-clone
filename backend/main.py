from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import SessionLocal, engine, Base

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users", response_model=List[schemas.User])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

@app.get("/groups", response_model=List[schemas.Group])
def get_groups(db: Session = Depends(get_db)):
    groups = db.query(models.Group).all()
    return groups

@app.post("/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/groups", response_model=schemas.Group)
def create_group(group: schemas.GroupCreate, db: Session = Depends(get_db)):
    db_group = models.Group(name=group.name)
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    for user_id in group.user_ids:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail=f"User {user_id} not found")
        db_group.users.append(user)
    db.commit()
    return db_group

@app.get("/groups/{group_id}", response_model=schemas.Group)
def get_group(group_id: int, db: Session = Depends(get_db)):
    group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return group

@app.post("/groups/{group_id}/expenses", response_model=schemas.Expense)
def add_expense(group_id: int, expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    if expense.paid_by not in [user.id for user in group.users]:
        raise HTTPException(status_code=400, detail="Paid_by user not in group")
    
    db_expense = models.Expense(
        group_id=group_id,
        description=expense.description,
        amount=expense.amount,
        paid_by=expense.paid_by,
        split_type=expense.split_type
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)

    if expense.split_type == "equal":
        split_amount = expense.amount / len(group.users)
        for user in group.users:
            db_split = models.Split(
                expense_id=db_expense.id,
                user_id=user.id,
                amount=split_amount
            )
            db.add(db_split)
    elif expense.split_type == "percentage":
        total_percentage = sum(split["percentage"] for split in expense.splits)
        if not (99 <= total_percentage <= 101):
            raise HTTPException(status_code=400, detail="Percentages must sum to 100")
        for split in expense.splits:
            user_id = int(list(split.keys())[0])
            percentage = split[str(user_id)]
            if user_id not in [user.id for user in group.users]:
                raise HTTPException(status_code=400, detail=f"User {user_id} not in group")
            db_split = models.Split(
                expense_id=db_expense.id,
                user_id=user_id,
                amount=(percentage / 100) * expense.amount,
                percentage=percentage
            )
            db.add(db_split)
    db.commit()
    return db_expense

@app.get("/groups/{group_id}/balances", response_model=List[schemas.Balance])
def get_group_balances(group_id: int, db: Session = Depends(get_db)):
    group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    balances = []
    for user in group.users:
        total_owed = 0
        for expense in group.expenses:
            paid_by = expense.paid_by == user.id
            split = db.query(models.Split).filter(
                models.Split.expense_id == expense.id,
                models.Split.user_id == user.id
            ).first()
            if split:
                if paid_by:
                    total_owed += expense.amount - split.amount
                else:
                    total_owed -= split.amount
        balances.append(schemas.Balance(user_id=user.id, name=user.name, amount_owed=total_owed))
    return balances