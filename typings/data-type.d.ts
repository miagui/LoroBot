
interface appsItemType {
   appid: number;
   name: string;
}

interface applistType {
   apps: Array<appsItemType>;
}

interface rootElementType {
   applist: applistType;
}
