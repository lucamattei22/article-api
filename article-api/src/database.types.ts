// import { MergeDeep } from 'type-fest'
import { Database as DatabaseGenerated } from "./database-generated.types";
export { Json } from "./database-generated.types";

export type Database = DatabaseGenerated;
// Override the type for a specific column in a view:
// export type Database = MergeDeep<
// DatabaseGenerated,
// {
//  views: {
//    my_view: { columns: {
//      my_column: {
//        type: 'text'
//      }
//    }
//  }
// }>
