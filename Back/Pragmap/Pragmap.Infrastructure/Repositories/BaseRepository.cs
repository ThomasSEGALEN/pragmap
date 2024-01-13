using Microsoft.EntityFrameworkCore;
using Pragmap.Domain.Common.Interfaces;
using Pragmap.Infrastructure.Context;
using Pragmap.Infrastructure.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Pragmap.Infrastructure.Repositories
{
    public class BaseRepository<TEntity> : IBaseRepository<TEntity> where TEntity : class
    {
        private readonly PragmapContext _context;
        private readonly DbSet<TEntity> _dbSet;
        public BaseRepository(PragmapContext context)
        {
            _context = context;
            _dbSet = context.Set<TEntity>();
        }

        public IQueryable<TEntity> GetAll()
        {
            return _dbSet.AsQueryable();
        }
        public IEnumerable<TEntity> GetAll(Expression<Func<TEntity, bool>> predicate)
        {
            return _dbSet.Where(predicate).AsEnumerable();
        }

        public IEnumerable<TEntity> GetAllSet()
        {
            return _dbSet.AsEnumerable();
        }

        public TEntity? Single(Guid id)
        {
            return _dbSet.Find(id);
        }

        public TEntity? Single(Func<TEntity, bool> predicate)
        {
            return _dbSet.FirstOrDefault(predicate);
        }

        public virtual void Add(TEntity entity)
        {
            if(entity is IDatedEntity) {
                ((IDatedEntity)entity).CreatedDate = DateTime.Now;
            }
            _dbSet.Add(entity);
        }

        public virtual void Delete(Guid id)
        {
            TEntity entityToDelete = _dbSet.Find(id);
            Delete(entityToDelete);
        }

        public virtual void Delete(TEntity entityToDelete)
        {
            if (_context.Entry(entityToDelete).State == EntityState.Detached)
            {
                _dbSet.Attach(entityToDelete);
            }
            _dbSet.Remove(entityToDelete);
        }

        public virtual void Update(TEntity entityToUpdate)
        {
            if(entityToUpdate is IDatedEntity)
            {
                ((IDatedEntity)entityToUpdate).ModifiedDate = DateTime.Now;
            }
            _dbSet.Attach(entityToUpdate);
            _context.Entry(entityToUpdate).State = EntityState.Modified;
        }

        public bool Any(Expression<Func<TEntity, bool>> predicate)
        {
            return _dbSet.Any(predicate);
        }
    }
}
