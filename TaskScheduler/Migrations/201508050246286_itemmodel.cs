namespace ToDoList.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class itemmodel : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Items", "TotalHours", c => c.Int());
            AlterColumn("dbo.Items", "HoursPerDay", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Items", "HoursPerDay", c => c.Int(nullable: false));
            AlterColumn("dbo.Items", "TotalHours", c => c.Int(nullable: false));
        }
    }
}
