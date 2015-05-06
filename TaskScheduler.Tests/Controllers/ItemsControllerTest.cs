using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ToDoList.Controllers;
using ToDoList.Models;
using ToDoList.Search;

namespace ToDoList.Tests.Controllers
{
    [TestClass]
    public class ItemsControllerTest
    {
        [TestMethod]
        public void TestGetItems()
        {
            ItemsController ic = new ItemsController();

            Item i = new Item()
            {
                ProjectName="Visual Studio Unit Testing",
                TaskName ="Test Controller",
                StartTime=Convert.ToDateTime("2015-05-06"),
                EndTime=Convert.ToDateTime("2015-05-26"),
                HoursPerDay=2,
                TotalHours=40,
                By="Hongyi"
            };

            if (ic.GetItems().Count() == 0) {
                for (int x = 0; x < 100; x++)
                {
                    ic.PostItem(i);
                }
            }
            

            Assert.IsTrue(ic.GetItems().Count()>0);

            Assert.AreEqual(20, ic.GetItems(20, 1).items.Count);

            Assert.IsTrue(ic.GetItems(20, 9999999).items.Count==0);

            Assert.IsFalse(ic.GetItems(20, 1).totalItems == 0);

            Assert.IsFalse(ic.GetItems(-1, -1).totalItems > 0);

            Assert.IsFalse(ic.GetItems(-1, -1).items.Count > 0);

        }

        [TestMethod]
        public void TestSearchItems()
        {
            ItemsController ic = new ItemsController();

            Item i = new Item()
            {
                ProjectName = "Visual Studio Unit Testing",
                TaskName = "Test Controller",
                StartTime = Convert.ToDateTime("2015-05-06"),
                EndTime = Convert.ToDateTime("2015-05-26"),
                HoursPerDay = 2,
                TotalHours = 40,
                By = "Hongyi"
            };

            if (ic.GetItems().Count() == 0)
            {
                for (int x = 0; x < 100; x++)
                {
                    ic.PostItem(i);
                }
            }

            SearchItem si = new SearchItem() {
                ProjectName = "Visual Studio Unit Testing",
                TaskName = "Test Controller"
            };

            si.Page = 1;
            si.PageSize = 20;

            Assert.IsTrue(ic.SearchItems(si).items.Count==20);

            si.ProjectName = "visual studio unit testing";

            Assert.AreEqual(20, ic.SearchItems(si).items.Count);

            si.ProjectName = "visual studio code unit testing";

            Assert.IsFalse(ic.SearchItems(si).items.Count==20);
        }
    }
}
