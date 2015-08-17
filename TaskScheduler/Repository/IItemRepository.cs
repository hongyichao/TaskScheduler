using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToDoList.Models;
using ToDoList.Search;
using ToDoList.ViewModels;

namespace ToDoList.Repository
{
    public interface IItemRepository : IDisposable
    {
        IQueryable<Item> GetAllItems();
        ItemViewModel GetPagedItems(int pageSize, int page);
        ItemViewModel GetSearchedItems(SearchItem searchItem);
        Item GetItemById(int id);
        void UpdateItem(Item item);
        void InsertItem(Item item);
        void DeleteItem(Item item);
        bool IsItemExisting(int id);
        void Save();
    }
}
