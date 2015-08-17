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
using ToDoList.Repository;
using ToDoList.ViewModels;
using ToDoList.Search;

namespace ToDoList.Controllers
{
    public class ItemsController : ApiController
    {
        //private ApplicationDbContext db = new ApplicationDbContext();
        private IItemRepository itemRepository; 
        private UnitOfWork unitOfWork = new UnitOfWork();
        
        public ItemsController()
        {
            this.itemRepository = unitOfWork.GetItemRepository();
        }

        public ItemsController(IItemRepository itemRepository)
        {
            this.itemRepository = itemRepository;
        }
        
        // GET: api/Items
        public IQueryable<Item> GetItems()
        {
            return itemRepository.GetAllItems();
        }

        [Route("api/items/{pageSize}/{Page}")]
        public ItemViewModel GetItems(int pageSize, int page) {

            return itemRepository.GetPagedItems(pageSize, page);
        }

        [Route("api/searchItems")]
        [HttpGet]
        public ItemViewModel SearchItems([FromUri]SearchItem searchItem)
        {
            return itemRepository.GetSearchedItems(searchItem);
        }
        
        // GET: api/Items/5
        [ResponseType(typeof(Item))]
        public IHttpActionResult GetItem(int id)
        {
            Item item = itemRepository.GetItemById(id);
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

            itemRepository.UpdateItem(item);

            try
            {
                itemRepository.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!itemRepository.IsItemExisting(id))
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

            itemRepository.InsertItem(item);
            itemRepository.Save();

            return CreatedAtRoute("DefaultApi", new { id = item.Id }, item);
        }

        // DELETE: api/Items/5
        [ResponseType(typeof(Item))]
        public IHttpActionResult DeleteItem(int id)
        {
            if (!itemRepository.IsItemExisting(id))
            {
                return NotFound();
            }

            Item item = itemRepository.GetItemById(id);

            itemRepository.DeleteItem(item);
            itemRepository.Save();

            return Ok(item);
        }

        protected override void Dispose(bool disposing)
        {
            itemRepository.Dispose();
            base.Dispose(disposing);
        }
    }
}