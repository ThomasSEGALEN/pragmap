using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Pragmap.Infrastructure.Repositories.Interfaces
{
    public interface IBaseRepository<TEntity> where TEntity : class
    {
        public IQueryable<TEntity> GetAll();
        public IEnumerable<TEntity> GetAllSet();
        public IEnumerable<TEntity> GetAll(Expression<Func<TEntity, bool>> predicate);
        public TEntity? Single(Guid id);
        public TEntity? Single(Func<TEntity, bool> predicate);
        public void Add(TEntity entity);
        public void Delete(Guid id);
        public void Delete(TEntity entityToDelete);
        public void Update(TEntity entityToUpdate);
        public bool Any(Expression<Func<TEntity, bool>> predicate);
    }
}
