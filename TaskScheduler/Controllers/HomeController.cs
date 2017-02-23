using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ToDoList.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return PartialView();
        }

        public ActionResult ItemList()
        {
            return PartialView();
        }

        public ActionResult Projects()
        {
            return PartialView();
        }

        public ActionResult ItemModal()
        {
            return PartialView();
        }

        public ActionResult ProjectModal() {
            return PartialView("ProjectModal");
        }

    }
}
