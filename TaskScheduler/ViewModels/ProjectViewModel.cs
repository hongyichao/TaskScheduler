using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ToDoList.Models;

namespace ToDoList.ViewModels
{
    public class ProjectViewModel
    {
        public int TotalNumber { get; set; }
        public ICollection<Project> Projects { get; set; } 
    }
}