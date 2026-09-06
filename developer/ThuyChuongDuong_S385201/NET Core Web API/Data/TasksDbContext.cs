using TasksApi.Models;
using Microsoft.EntityFrameworkCore;

namespace TasksApi.Data;

public sealed class TasksDbContext(DbContextOptions<TasksDbContext> options) : DbContext(options)
{
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.ToTable("Tasks");
            entity.HasKey(task => task.Id);
            entity.Property(task => task.Id).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.Property(task => task.Title).HasMaxLength(200).IsRequired();
            entity.Property(task => task.Description).HasColumnType("nvarchar(max)");
            entity.Property(task => task.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
        });
    }
}