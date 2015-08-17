using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToDoList.Models;
using ToDoList.Search;
using ToDoList.ViewModels;

namespace ToDoList.Repository
{
    public interface IProjectRepository : IDisposable
    {
        IQueryable<Project> GetAllProjects();
        ProjectViewModel GetPagedProjects(int pageSize, int page);
        ProjectViewModel GetSearchedProjects(SearchProject searchProject);
        Project GetProjectById(int id);
        void UpdateProject(int id, Project project);
        void InsertProject(Project project);
        void DeleteProject(int id);
        void Save();
    }
}
