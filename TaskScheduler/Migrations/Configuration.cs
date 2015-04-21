namespace ToDoList.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using ToDoList.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<ToDoList.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(ToDoList.Models.ApplicationDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

                context.Items.AddOrUpdate(
                  p => p.ProjectName,
                  new Item { ProjectName="Project 1", TaskName="Task 1", By="Hongyi Chao", StartTime=Convert.ToDateTime("2015-04-01"), EndTime=Convert.ToDateTime("2015-04-28")},
                  new Item { ProjectName="Project 2", TaskName="Task 1", By="Lucas Chao", StartTime=Convert.ToDateTime("2015-05-01"), EndTime=Convert.ToDateTime("2015-05-28")},
                  new Item { ProjectName="Project 3", TaskName="Task 1", By="Terry Chao", StartTime=Convert.ToDateTime("2015-06-01"), EndTime=Convert.ToDateTime("2015-06-28")},
                  new Item { ProjectName="Project 1", TaskName="Task 1", By="Hongyi Chao", StartTime=Convert.ToDateTime("2015-04-01"), EndTime=Convert.ToDateTime("2015-04-28")},
                  new Item { ProjectName="Project 2", TaskName="Task 1", By="Lucas Chao", StartTime=Convert.ToDateTime("2015-05-01"), EndTime=Convert.ToDateTime("2015-05-28")},
                  new Item { ProjectName="Project 3", TaskName="Task 1", By="Terry Chao", StartTime=Convert.ToDateTime("2015-06-01"), EndTime=Convert.ToDateTime("2015-06-28")},
                  new Item { ProjectName="Project 1", TaskName="Task 1", By="Hongyi Chao", StartTime=Convert.ToDateTime("2015-04-01"), EndTime=Convert.ToDateTime("2015-04-28")},
                  new Item { ProjectName="Project 2", TaskName="Task 1", By="Lucas Chao", StartTime=Convert.ToDateTime("2015-05-01"), EndTime=Convert.ToDateTime("2015-05-28")},
                  new Item { ProjectName="Project 3", TaskName="Task 1", By="Terry Chao", StartTime=Convert.ToDateTime("2015-06-01"), EndTime=Convert.ToDateTime("2015-06-28")},
                  new Item { ProjectName="Project 1", TaskName="Task 1", By="Hongyi Chao", StartTime=Convert.ToDateTime("2015-04-01"), EndTime=Convert.ToDateTime("2015-04-28")},
                  new Item { ProjectName="Project 2", TaskName="Task 1", By="Lucas Chao", StartTime=Convert.ToDateTime("2015-05-01"), EndTime=Convert.ToDateTime("2015-05-28")},
                  new Item { ProjectName="Project 3", TaskName="Task 1", By="Terry Chao", StartTime=Convert.ToDateTime("2015-06-01"), EndTime=Convert.ToDateTime("2015-06-28")},
                  new Item { ProjectName="Project 1", TaskName="Task 1", By="Hongyi Chao", StartTime=Convert.ToDateTime("2015-04-01"), EndTime=Convert.ToDateTime("2015-04-28")},
                  new Item { ProjectName="Project 2", TaskName="Task 1", By="Lucas Chao", StartTime=Convert.ToDateTime("2015-05-01"), EndTime=Convert.ToDateTime("2015-05-28")},
                  new Item { ProjectName="Project 3", TaskName="Task 1", By="Terry Chao", StartTime=Convert.ToDateTime("2015-06-01"), EndTime=Convert.ToDateTime("2015-06-28")},
                  new Item { ProjectName="Project 1", TaskName="Task 1", By="Hongyi Chao", StartTime=Convert.ToDateTime("2015-04-01"), EndTime=Convert.ToDateTime("2015-04-28")},
                  new Item { ProjectName="Project 2", TaskName="Task 1", By="Lucas Chao", StartTime=Convert.ToDateTime("2015-05-01"), EndTime=Convert.ToDateTime("2015-05-28")},
                  new Item { ProjectName="Project 3", TaskName="Task 1", By="Terry Chao", StartTime=Convert.ToDateTime("2015-06-01"), EndTime=Convert.ToDateTime("2015-06-28")},
                  new Item { ProjectName="Project 1", TaskName="Task 1", By="Hongyi Chao", StartTime=Convert.ToDateTime("2015-04-01"), EndTime=Convert.ToDateTime("2015-04-28")},
                  new Item { ProjectName="Project 2", TaskName="Task 1", By="Lucas Chao", StartTime=Convert.ToDateTime("2015-05-01"), EndTime=Convert.ToDateTime("2015-05-28")},
                  new Item { ProjectName="Project 3", TaskName="Task 1", By="Terry Chao", StartTime=Convert.ToDateTime("2015-06-01"), EndTime=Convert.ToDateTime("2015-06-28")},
                  new Item { ProjectName="Project 1", TaskName="Task 1", By="Hongyi Chao", StartTime=Convert.ToDateTime("2015-04-01"), EndTime=Convert.ToDateTime("2015-04-28")},
                  new Item { ProjectName="Project 2", TaskName="Task 1", By="Lucas Chao", StartTime=Convert.ToDateTime("2015-05-01"), EndTime=Convert.ToDateTime("2015-05-28")},
                  new Item { ProjectName="Project 3", TaskName="Task 1", By="Terry Chao", StartTime=Convert.ToDateTime("2015-06-01"), EndTime=Convert.ToDateTime("2015-06-28")},
                  new Item { ProjectName="Project 1", TaskName="Task 1", By="Hongyi Chao", StartTime=Convert.ToDateTime("2015-04-01"), EndTime=Convert.ToDateTime("2015-04-28")},
                  new Item { ProjectName="Project 2", TaskName="Task 1", By="Lucas Chao", StartTime=Convert.ToDateTime("2015-05-01"), EndTime=Convert.ToDateTime("2015-05-28")},
                  new Item { ProjectName="Project 3", TaskName="Task 1", By="Terry Chao", StartTime=Convert.ToDateTime("2015-06-01"), EndTime=Convert.ToDateTime("2015-06-28")},
                  new Item { ProjectName="Project 1", TaskName="Task 1", By="Hongyi Chao", StartTime=Convert.ToDateTime("2015-04-01"), EndTime=Convert.ToDateTime("2015-04-28")},
                  new Item { ProjectName="Project 2", TaskName="Task 1", By="Lucas Chao", StartTime=Convert.ToDateTime("2015-05-01"), EndTime=Convert.ToDateTime("2015-05-28")},
                  new Item { ProjectName="Project 3", TaskName="Task 1", By="Terry Chao", StartTime=Convert.ToDateTime("2015-06-01"), EndTime=Convert.ToDateTime("2015-06-28")},
                  new Item { ProjectName="Project 1", TaskName="Task 1", By="Hongyi Chao", StartTime=Convert.ToDateTime("2015-04-01"), EndTime=Convert.ToDateTime("2015-04-28")},
                  new Item { ProjectName="Project 2", TaskName="Task 1", By="Lucas Chao", StartTime=Convert.ToDateTime("2015-05-01"), EndTime=Convert.ToDateTime("2015-05-28")},
                  new Item { ProjectName="Project 3", TaskName="Task 1", By="Terry Chao", StartTime=Convert.ToDateTime("2015-06-01"), EndTime=Convert.ToDateTime("2015-06-28")},
                  new Item { ProjectName="Project 1", TaskName="Task 1", By="Hongyi Chao", StartTime=Convert.ToDateTime("2015-04-01"), EndTime=Convert.ToDateTime("2015-04-28")},
                  new Item { ProjectName="Project 2", TaskName="Task 1", By="Lucas Chao", StartTime=Convert.ToDateTime("2015-05-01"), EndTime=Convert.ToDateTime("2015-05-28")},
                  new Item { ProjectName="Project 3", TaskName="Task 1", By="Terry Chao", StartTime=Convert.ToDateTime("2015-06-01"), EndTime=Convert.ToDateTime("2015-06-28")}
                );
        }
    }
}
