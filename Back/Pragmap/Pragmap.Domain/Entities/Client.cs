namespace Pragmap.Domain.Entities
{
    public class Client
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Logo { get; set; }
        public string GestionnaireUser { get; set; }
        public ICollection<RoadMap> roadMaps { get; set; }

    }
}