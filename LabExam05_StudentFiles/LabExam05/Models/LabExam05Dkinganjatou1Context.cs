using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace LabExam05.Models;

public partial class LabExam05Dkinganjatou1Context : DbContext
{
    public LabExam05Dkinganjatou1Context()
    {
    }

    public LabExam05Dkinganjatou1Context(DbContextOptions<LabExam05Dkinganjatou1Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Merchandise> Merchandises { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=data.cnt.sast.ca,24680;Database=LabExam05_dkinganjatou1;User Id=dkinganjatou1;Password=NaitKid181; Encrypt=False;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Merchandise>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Merchand__3214EC07B9F2EF35");

            entity.ToTable("Merchandise");

            entity.Property(e => e.Category).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
