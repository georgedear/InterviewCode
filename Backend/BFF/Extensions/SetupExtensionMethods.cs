using BFF.Interfaces;
using BFF.Repository;
using BFF.Services;

namespace BFF.Extensions;

public static class SetupExtensionMethods
{
    public static void AddRepositories(this IServiceCollection services)
    {
        services.AddSingleton<ICurrencyRepository, CurrencyRepository>();
    }

    public static void AddServices(this IServiceCollection services)
    {
        services.AddSingleton<ICurrencyService, CurrencyService>();
    }
}