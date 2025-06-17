from pydantic import BaseModel
from typing import List, Optional, Dict

class UserBase(BaseModel):
    name: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class GroupBase(BaseModel):
    name: str
    user_ids: List[int]

class GroupCreate(GroupBase):
    pass

class Group(GroupBase):
    id: int
    users: List[User]
    class Config:
        from_attributes = True

class ExpenseBase(BaseModel):
    description: str
    amount: float
    paid_by: int
    split_type: str  # "equal" or "percentage"
    splits: List[Dict[str, float]]  # user_id: amount or percentage

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: int
    group_id: int
    class Config:
        from_attributes = True

class Balance(BaseModel):
    user_id: int
    name: str
    amount_owed: float