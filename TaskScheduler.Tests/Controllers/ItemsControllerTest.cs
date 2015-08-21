using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ToDoList.Controllers;
using ToDoList.Models;
using ToDoList.Search;
using ToDoList.Repository;
using Moq; //add Moq in order to use Mock object for testing
using ToDoList.ViewModels;

namespace ToDoList.Tests.Controllers
{
    [TestClass]
    public class ItemsControllerTest
    {
        [TestMethod]
        public void TestGetItems()
        {
            int pageSize =0;
            int page=0;
            ICollection<Item> itemList = new List<Item>() { };

            for (int x = 0; x < 100; x++)
            {
                itemList.Add(new Item());
            }

            var mockItemRepo = new Mock<IItemRepository>();



            mockItemRepo = SetupGetPagedItems(mockItemRepo, itemList, 10, 1);

            mockItemRepo = SetupGetPagedItems(mockItemRepo, itemList, 20, 9999999);
            
            mockItemRepo = SetupGetPagedItems(mockItemRepo, itemList, 20, 1);

            mockItemRepo = SetupGetPagedItems(mockItemRepo, itemList, -1, -1);
            
            ItemsController ic = new ItemsController(mockItemRepo.Object);

            Assert.IsTrue(ic.GetItems(10,1).totalItems>0);

            Assert.AreEqual(10, ic.GetItems(10, 1).items.Count);

            Assert.AreEqual(100, ic.GetItems(10,1).totalItems);

            Assert.IsTrue(ic.GetItems(20, 9999999).items.Count==0);

            Assert.IsFalse(ic.GetItems(20, 1).totalItems == 0);

            Assert.IsTrue(ic.GetItems(-1, -1).totalItems > 0);

            Assert.IsFalse(ic.GetItems(-1, -1).items.Count > 0);

        }


        private Mock<IItemRepository> SetupGetPagedItems(Mock<IItemRepository> mockItemRepo, 
            ICollection<Item> itemList, 
            int pageSize, int page)
        {
            mockItemRepo.Setup(it => it.GetPagedItems(pageSize, page)).Returns(new ItemViewModel()
            {
                totalItems = itemList.Count,
                items = itemList.OrderBy(i => i.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize).ToList()
            });

            return mockItemRepo;
        }

        [TestMethod]
        public void TestSearchItems()
        {
            var items = new List<Item>();

            for (int x = 0; x < 100; x++)
            {
                items.Add(new Item(){ProjectName = "Project " + x.ToString()});
            }

            var itemRepo = new Mock<IItemRepository>(); 

            var searchedItem = new SearchItem() {ProjectName = "project 1", 
                Page = 1, PageSize = 10};

            itemRepo = SetupGetSearchedItem(itemRepo, items, searchedItem);
            
            ItemsController ic = new ItemsController(itemRepo.Object);

            Assert.AreEqual(11, ic.SearchItems(searchedItem).totalItems);
            Assert.AreEqual(10, ic.SearchItems(searchedItem).items.Count);
            Assert.IsTrue(ic.SearchItems(searchedItem).items.Count == 10);
            Assert.IsFalse(ic.SearchItems(searchedItem).items.Count==20);
            
        }

        private Mock<IItemRepository> SetupGetSearchedItem(Mock<IItemRepository> itemRepo, List<Item> items,
            SearchItem searchedItem)
        {
            var selectedItems = items.Where(i => (i.ProjectName.ToLower()
                .Contains(searchedItem.ProjectName.ToLower()) || string.IsNullOrEmpty(searchedItem.ProjectName))
                && (i.By == searchedItem.By || string.IsNullOrEmpty(searchedItem.By))
                );

            itemRepo.Setup(i => i.GetSearchedItems(searchedItem))
                .Returns(new ItemViewModel()
                         {
                             totalItems = selectedItems.Count(), 
                             items = selectedItems
                            .OrderBy(i => i.Id)
                            .Skip((searchedItem.Page - 1) * searchedItem.PageSize)
                            .Take(searchedItem.PageSize).ToList()
                         });

            return itemRepo;
        }
    }
}
