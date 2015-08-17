using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using ToDoList.Models;
using ToDoList.Search;
using ToDoList.ViewModels;

namespace ToDoList.Repository
{
    public class ItemRepository : IItemRepository, IDisposable
    {
        private ApplicationDbContext db;

        public ItemRepository(ApplicationDbContext db)
        {
            this.db = db;
        }

        public IQueryable<Item> GetAllItems()
        {
            return db.Items;
        }

        public ItemViewModel GetPagedItems(int pageSize, int page)
        {
            if (pageSize <= 0)
            {
                return new ItemViewModel() { totalItems = 0, items = new List<Item>() };
            }

            if (page <= 0)
            {
                return new ItemViewModel() { totalItems = 0, items = new List<Item>() };
            }

            var selectedItems = db.Items
                .OrderBy(i => i.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize).ToList();

            return new ItemViewModel() { totalItems = db.Items.Count(), items = selectedItems };
        }

        public ItemViewModel GetSearchedItems(SearchItem searchItem)
        {
            var selectedItems = db.Items.Where(i => (i.ProjectName.ToLower().Contains(searchItem.ProjectName.ToLower()) || string.IsNullOrEmpty(searchItem.ProjectName))
                && (i.By == searchItem.By || string.IsNullOrEmpty(searchItem.By))
                );


            var pageCount = Convert.ToInt16(Math.Ceiling(Convert.ToDecimal(selectedItems.Count()) / searchItem.PageSize));

            var itemPaged = selectedItems
                .OrderBy(i => i.Id)
                .Skip((searchItem.Page - 1) * searchItem.PageSize)
                .Take(searchItem.PageSize).ToList();

            return new ItemViewModel() { totalItems = selectedItems.Count(), items = itemPaged };
        }

        public Item GetItemById(int id)
        {
            return  db.Items.Find(id);
        }

        public void UpdateItem(Item item)
        {
            db.Entry(item).State = EntityState.Modified;
        }

        public void InsertItem(Item item)
        {
            db.Items.Add(item);
        }

        public void DeleteItem(Item item)
        {
            db.Items.Remove(item);
        }

        public bool IsItemExisting(int id)
        {
            return db.Items.Count(e => e.Id == id) > 0;
        }

        public void Save()
        {
            db.SaveChanges();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    db.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

    }
}