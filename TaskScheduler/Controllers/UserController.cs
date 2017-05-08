using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ToDoList.Controllers
{
    [AllowAnonymous]
    public class UserController : Controller
    {
        // GET: Login
        public ActionResult Login()
        {
            return PartialView();
        }

        public ActionResult Register()
        {
            return PartialView();
        }
    }
}