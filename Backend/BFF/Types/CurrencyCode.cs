using System.ComponentModel;
using System.Globalization;
using System.Text.RegularExpressions;

namespace BFF.Types;

[TypeConverter(typeof(CurrencyCodeTypeConverter))]
public readonly struct CurrencyCode : IEquatable<CurrencyCode>
{
    private static readonly Regex Regex = new(@"^[A-Z]{3}$", RegexOptions.Compiled);

    public string Value { get; }

    public CurrencyCode(string value)
    {
        if (!IsValid(value))
            throw new ArgumentException(
                "Currency code must be exactly 3 uppercase letters (e.g. USD, GBP).", nameof(value));

        Value = value;
    }

    public static bool IsValid(string value)
    {
        return !string.IsNullOrEmpty(value) && Regex.IsMatch(value);
    }

    public static bool TryParse(string value, out CurrencyCode result)
    {
        if (IsValid(value))
        {
            result = new CurrencyCode(value);
            return true;
        }

        result = default;
        return false;
    }

    public override string ToString()
    {
        return Value;
    }

    // Implicitly try to convert from string to CurrencyCode type
    public static implicit operator CurrencyCode(string value)
    {
        return new CurrencyCode(value);
    }

    public static implicit operator string(CurrencyCode code)
    {
        return code.Value;
    }

    public bool Equals(CurrencyCode other)
    {
        return Value == other.Value;
    }

    public override bool Equals(object? obj)
    {
        return obj is CurrencyCode other && Equals(other);
    }

    public override int GetHashCode()
    {
        return Value?.GetHashCode() ?? 0;
    }

    public static bool operator ==(CurrencyCode left, CurrencyCode right)
    {
        return left.Equals(right);
    }

    public static bool operator !=(CurrencyCode left, CurrencyCode right)
    {
        return !left.Equals(right);
    }
}

// Allows ASP.NET to bind query string/route values to CurrencyCode automatically
public class CurrencyCodeTypeConverter : TypeConverter
{
    public override bool CanConvertFrom(ITypeDescriptorContext? context, Type sourceType)
    {
        return sourceType == typeof(string) || base.CanConvertFrom(context, sourceType);
    }

    public override object ConvertFrom(ITypeDescriptorContext? context, CultureInfo? culture, object value)
    {
        if (value is string s)
        {
            if (CurrencyCode.TryParse(s, out var code))
                return code;

            throw new FormatException($"'{s}' is not a valid currency code.");
        }

        return base.ConvertFrom(context, culture, value)!;
    }
}