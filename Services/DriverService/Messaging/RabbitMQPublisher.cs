using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace DriverService.Messaging
{
    public interface IMessagePublisher
    {
        Task PublishAsync<T>(string exchangeName, string routingKey, T message);
    }

    public class RabbitMQPublisher : IMessagePublisher, IDisposable
    {
        private readonly IConnection _connection;
        private readonly IChannel _channel;
        private readonly ILogger<RabbitMQPublisher> _logger;

        public RabbitMQPublisher(IConfiguration configuration, ILogger<RabbitMQPublisher> logger)
        {
            _logger = logger;
            var factory = new ConnectionFactory()
            {
                HostName = configuration["RabbitMQ:HostName"] ?? "localhost",
                Port = int.Parse(configuration["RabbitMQ:Port"] ?? "5672"),
                UserName = configuration["RabbitMQ:UserName"] ?? "guest",
                Password = configuration["RabbitMQ:Password"] ?? "guest"
            };
              _connection = factory.CreateConnectionAsync().Result;
            _channel = _connection.CreateChannelAsync().Result;
        }
 public async Task PublishAsync<T>(string exchangeName, string routingKey, T message)
        {
            try
            {
                await _channel.ExchangeDeclareAsync(exchange: exchangeName, type: ExchangeType.Topic, durable: true);
   // Declare the consumer queue and bind it to the exchange so messages are
                // not lost if AlertService hasn't started yet when the first message is published.
                var queueDeclareResult = await _channel.QueueDeclareAsync(
                    queue: "alert-service-queue",
                    durable: true,
                    exclusive: false,
                    autoDelete: false);

                await _channel.QueueBindAsync(
                    queue: queueDeclareResult.QueueName,
                    exchange: exchangeName,
                    routingKey: "driver.*");

                var jsonMessage = JsonSerializer.Serialize(message);
                var body = Encoding.UTF8.GetBytes(jsonMessage);

                await _channel.BasicPublishAsync(
                    exchange: exchangeName,
                    routingKey: routingKey,
                    body: body);

                _logger.LogInformation($"Published message to {exchangeName}/{routingKey}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error publishing message to {exchangeName}/{routingKey}");
                throw;
            }
        }

        public void Dispose()
        {
            _channel?.Dispose();
            _connection?.Dispose();
        }
    }
}
