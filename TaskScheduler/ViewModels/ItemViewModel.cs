using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ToDoList.Models;

namespace ToDoList.ViewModels
{
    public class ItemViewModel
    {
        public int totalItems { get; set; }
        public ICollection<Item> items { get; set; }
    }
}