from sqlalchemy import Column, Integer, String, Float, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

group_users = Table(
    "group_users",
    Base.metadata,
    Column("group_id", Integer, ForeignKey("groups.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    groups = relationship("Group", secondary=group_users, back_populates="users")

class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    users = relationship("User", secondary=group_users, back_populates="groups", overlaps="groups")
    expenses = relationship("Expense", back_populates="group")

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"))
    description = Column(String)
    amount = Column(Float)
    paid_by = Column(Integer, ForeignKey("users.id"))
    split_type = Column(String)
    group = relationship("Group", back_populates="expenses")
    splits = relationship("Split", back_populates="expense")

class Split(Base):
    __tablename__ = "splits"
    id = Column(Integer, primary_key=True, index=True)
    expense_id = Column(Integer, ForeignKey("expenses.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    percentage = Column(Float, nullable=True)
    expense = relationship("Expense", back_populates="splits")