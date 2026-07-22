export const INDONESIAN_MOBILE_REGEX = /^8\d{8,11}$/;

export function toNationalPhoneInput(rawValue:string): string {
    let digits = rawValue.replace(/\D/g, "");

    if (digits.startsWith("62")) {
        digits = digits.slice(2);
    }
    if (digits.startsWith("0")) {
        digits = digits.slice(1);
    }

    return digits.slice(0, 12);
}

export function toIndonesianE164(rawValue:string): string {
    const nationalNumber = toNationalPhoneInput(rawValue);
    return nationalNumber? `+62${nationalNumber}` : "";
}