import i18n from 'i18next';

export interface CurrencyFormatter {
    (value: number | bigint, currency?: string): string;
}

export interface NumberFormatter {
    (value: number | bigint): string;
}

export interface DateFormatter {
    (value: Date | string | number): string;
}

export interface Formatters {
    currency: CurrencyFormatter;
    number: NumberFormatter;
    date: DateFormatter;
}

export const formatters: Formatters = {
    currency: (value, currency = 'USD') =>
        new Intl.NumberFormat(i18n.language || navigator.language, {
            style: 'currency',
            currency,
        }).format(value),

    number: (value) =>
        new Intl.NumberFormat(i18n.language || navigator.language).format(value),

    date: (value) =>
        new Intl.DateTimeFormat(i18n.language || navigator.language, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(value)),
};
