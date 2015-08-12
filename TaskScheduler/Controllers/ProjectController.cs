using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Antlr.Runtime;
using ToDoList.Models;
using ToDoList.Search;
using ToDoList.ViewModels;

namespace ToDoList.Controllers
{
    public class ProjectController : ApiController
    {        
        private ApplicationDbContext db = new ApplicationDbContext();

        public IQueryable GetProjects() {
            return db.Projects;
        }

        [Route("api/project/{pageSize}/{page}")]
        public ProjectViewModel GetProjects(int pageSize, int page)
        {
            
            if (pageSize <= 0 || page<=0)
            {
                return new ProjectViewModel(){TotalNumber = 0, Projects = new List<Project>()};
            }

            var selectedProjects = db.Projects.OrderBy(p => p.Id).Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return new ProjectViewModel(){TotalNumber = selectedProjects.Count, Projects = selectedProjects};

        }

        [Route("api/searchProject")]
        [HttpGet]
        public ProjectViewModel SearchProjects([FromUri]SearchProject searchProject)
        {
            if (searchProject.PageSize <= 0 || searchProject.Page <= 0)
            {
                return new ProjectViewModel() { TotalNumber = 0, Projects = new List<Project>() };
            }

            var selectedProjects = from p in db.Projects
                                   where string.IsNullOrEmpty(searchProject.ProjectName) || p.Name == searchProject.ProjectName
                                   select p;

            var pageCount = Convert.ToInt16(Math.Ceiling(Convert.ToDecimal(selectedProjects.Count()) / searchProject.PageSize));

            var projectPaged = selectedProjects.OrderBy(p => p.Id)
                .Skip((searchProject.Page - 1) * searchProject.PageSize)
                .Take(searchProject.PageSize).ToList();

            return new ProjectViewModel(){TotalNumber = projectPaged.Count, Projects = projectPaged};
        }

        public ProjectViewModel GetProject(int id)
        {
            Project p = db.Projects.Find(id);

            return new ProjectViewModel(){TotalNumber = 1, Projects = new List<Project>(){p}};
        }

        public IHttpActionResult PutProject(int id, Project p)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != p.Id)
            {
                return BadRequest();
            }

            db.Entry(p).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (Exception)
            {
                if (!IsProjectExists(p.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        public IHttpActionResult PostProject(Project p)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Projects.Add(p);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = p.Id }, p);
        }

        public IHttpActionResult DeleteProject(int id)
        {
            Project p = db.Projects.Find(id);

            if (p == null)
            {
                return NotFound();
            }

            db.Projects.Remove(p);
            db.SaveChanges();

            return Ok(p);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        public bool IsProjectExists(int id)
        {
            return db.Projects.Count(p => p.Id == id) > 0;
        }

    }
}
