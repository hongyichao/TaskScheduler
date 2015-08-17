using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ToDoList.Models;

namespace ToDoList.Repository
{
    public class UnitOfWork
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        
        public ItemRepository GetItemRepository()
        {
            return new ItemRepository(db);
        }
    }
}