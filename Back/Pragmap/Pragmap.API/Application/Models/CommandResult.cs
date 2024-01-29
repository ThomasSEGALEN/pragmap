namespace Pragmap.API.Application.Models
{
    public class CommandResult<T> where T : class
    {
        public bool IsSuccess { get; set; }
        public string Error { get; set; }
        public T Data { get; set; }
        public static CommandResult<T> Success(T data)
        {
            return new CommandResult<T>
            {
                IsSuccess = true,
                Data = data
            };
        }

        public static CommandResult<T> Failed(string message)
        {
            return new CommandResult<T>
            {
                IsSuccess = false,
                Error = message
            };
        }
    }

    public class CommandResult<T, U> where T : class where U : class
    {
        public bool IsSuccess { get; set; }
        public T Data { get; set; }
        public U Error { get; set; }
        public static CommandResult<T, U> Success(T data)
        {
            return new CommandResult<T, U>
            {
                IsSuccess = true,
                Data = data
            };
        }

        public static CommandResult<T, U> Failed(U error)
        {
            return new CommandResult<T, U>
            {
                IsSuccess = false,
                Error = error
            };
        }
    }

    public class CommandResult
    {
        public bool IsSuccess { get; set; }
        public string Error { get; set; }

        public static CommandResult Success()
        {
            return new CommandResult
            {
                IsSuccess = true
            };
        }

        public static CommandResult Failed(string message)
        {
            return new CommandResult
            {
                IsSuccess = false,
                Error = message
            };
        }
    }
}
