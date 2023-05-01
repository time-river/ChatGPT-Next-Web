import Locale from "@/app/locales";

export function t(key: string) {
    if (key in Locale.User) {
      return Locale.User[key as keyof typeof Locale.User];
    } else {
      return "FIXME";
    }
};