using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ToDoList.Search
{
    public class SearchItem
    {
        public int Id { get; set; }
        public string ProjectName { get; set; }
        public string TaskName { get; set; }        
        public string By { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int TotalHours { get; set; }
        public int HoursPerDay { get; set; }

        public int PageSize { get; set; }
        public int Page { get; set; }
    }
}