using BFF.Types;

namespace BFF.Model;

public record ExchangeRate(CurrencyCode From, CurrencyCode To, decimal Rate);