using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using ToDoList.Models;
using ToDoList.ViewModels;
using ToDoList.Search;

namespace ToDoList.Controllers
{
    public class ItemsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Items
        public IQueryable<Item> GetItems()
        {
            return db.Items;
        }

        [Route("api/items/{pageSize}/{Page}")]
        public ItemViewModel GetItems(int pageSize, int page) {

            if (pageSize <= 0) {
                return new ItemViewModel() { totalItems = 0, items = new List<Item>() };
            }

            if (page <= 0) {
                return new ItemViewModel() { totalItems = 0, items = new List<Item>() };
            }

            var selectedItems= db.Items
                .OrderBy(i => i.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize).ToList();

            return new ItemViewModel() { totalItems=db.Items.Count(), items = selectedItems  };
        }

        [Route("api/searchItems")]
        [HttpGet]
        public ItemViewModel SearchItems([FromUri]SearchItem searchItem)
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
        
        // GET: api/Items/5
        [ResponseType(typeof(Item))]
        public IHttpActionResult GetItem(int id)
        {
            Item item = db.Items.Find(id);
            if (item == null)
            {
                return NotFound();
            }

            return Ok(item);
        }

        // PUT: api/Items/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutItem(int id, Item item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != item.Id)
            {
                return BadRequest();
            }

            db.Entry(item).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExists(id))
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

        // POST: api/Items
        [ResponseType(typeof(Item))]
        public IHttpActionResult PostItem(Item item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Items.Add(item);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = item.Id }, item);
        }

        // DELETE: api/Items/5
        [ResponseType(typeof(Item))]
        public IHttpActionResult DeleteItem(int id)
        {
            Item item = db.Items.Find(id);
            if (item == null)
            {
                return NotFound();
            }

            db.Items.Remove(item);
            db.SaveChanges();

            return Ok(item);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ItemExists(int id)
        {
            return db.Items.Count(e => e.Id == id) > 0;
        }
    }
}