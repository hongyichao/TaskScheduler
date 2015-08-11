using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ToDoList.Models;

namespace ToDoList.Controllers
{
    public class ProjectController : ApiController
    {        
        private ApplicationDbContext db = new ApplicationDbContext();

        public IQueryable GetItems() {
            return db.Projects;
        }


    }
}
