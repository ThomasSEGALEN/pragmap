using Npgsql;


class UsersServices
{

    public static List<User> GetUsers()
    {
        List<User> users = new();

        using (NpgsqlConnection connection = new NpgsqlConnection(Constantes.DATABASE))
        {
            connection.Open();

            using (NpgsqlCommand command = new NpgsqlCommand("SELECT user_id, username, email, date_joined FROM users", connection))
            using (NpgsqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    User user = new()
                    {
                        UserId = reader.GetInt32(0),
                        Username = reader.GetString(1),
                        Email = reader.GetString(2),
                        RegistrationDate = reader.GetDateTime(3)
                    };

                    users.Add(user);
                }
            }

            connection.Close();
        }

        return users;
    }
}