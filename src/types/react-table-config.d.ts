import {
    UseColumnOrderInstanceProps,
    UseColumnOrderState,
    UseExpandedHooks,
    UseExpandedInstanceProps,
    UseExpandedOptions,
    UseExpandedRowProps,
    UseExpandedState,
    UseFiltersColumnOptions,
    UseFiltersColumnProps,
    UseFiltersInstanceProps,
    UseFiltersOptions,
    UseFiltersState,
    UseGlobalFiltersColumnOptions,
    UseGlobalFiltersInstanceProps,
    UseGlobalFiltersOptions,
    UseGlobalFiltersState,
    UseGroupByCellProps,
    UseGroupByColumnOptions,
    UseGroupByColumnProps,
    UseGroupByHooks,
    UseGroupByInstanceProps,
    UseGroupByOptions,
    UseGroupByRowProps,
    UseGroupByState,
    UsePaginationInstanceProps,
    UsePaginationOptions,
    UsePaginationState,
    UseResizeColumnsColumnOptions,
    UseResizeColumnsColumnProps,
    UseResizeColumnsOptions,
    UseResizeColumnsState,
    UseRowSelectHooks,
    UseRowSelectInstanceProps,
    UseRowSelectOptions,
    UseRowSelectRowProps,
    UseRowSelectState,
    UseRowStateCellProps,
    UseRowStateInstanceProps,
    UseRowStateOptions,
    UseRowStateRowProps,
    UseRowStateState,
    UseSortByColumnOptions,
    UseSortByColumnProps,
    UseSortByHooks,
    UseSortByInstanceProps,
    UseSortByOptions,
    UseSortByState
} from 'react-table';
  
  declare module 'react-table' {
    // take this file as-is, or comment out the sections that don't apply to your plugin configuration
  
    //eslint-disable-next-line
    export interface TableOptions<D extends object>
      extends UseExpandedOptions<D>,
        UseFiltersOptions<D>,
        UseGlobalFiltersOptions<D>,
        UseGroupByOptions<D>,
        UsePaginationOptions<D>,
        UseResizeColumnsOptions<D>,
        UseRowSelectOptions<D>,
        UseRowStateOptions<D>,
        UseSortByOptions<D>,
        // note that having Record here allows you to add anything to the options, this matches the spirit of the
        // underlying js library, but might be cleaner if it's replaced by a more specific type that matches your
        // feature set, this is a safe default.
        Record<string, any> {}
  
        //eslint-disable-next-line
    export interface Hooks<D extends object = {}>
      extends UseExpandedHooks<D>,
        UseGroupByHooks<D>,
        UseRowSelectHooks<D>,
        UseSortByHooks<D> {}
  
        //eslint-disable-next-line
    export interface TableInstance<D extends object = {}>
      extends UseColumnOrderInstanceProps<D>,
        UseExpandedInstanceProps<D>,
        UseFiltersInstanceProps<D>,
        UseGlobalFiltersInstanceProps<D>,
        UseGroupByInstanceProps<D>,
        UsePaginationInstanceProps<D>,
        UseRowSelectInstanceProps<D>,
        UseRowStateInstanceProps<D>,
        UseSortByInstanceProps<D> {}
  
        //eslint-disable-next-line
    export interface TableState<D extends object = {}>
      extends UseColumnOrderState<D>,
        UseExpandedState<D>,
        UseFiltersState<D>,
        UseGlobalFiltersState<D>,
        UseGroupByState<D>,
        UsePaginationState<D>,
        UseResizeColumnsState<D>,
        UseRowSelectState<D>,
        UseRowStateState<D>,
        UseSortByState<D> {
            rowCount: number
        }
  
        //eslint-disable-next-line
    export interface ColumnInterface<D extends object = {}>
      extends UseFiltersColumnOptions<D>,
        UseGlobalFiltersColumnOptions<D>,
        UseGroupByColumnOptions<D>,
        UseResizeColumnsColumnOptions<D>,
        UseSortByColumnOptions<D> {
            align?: string
        }
  
        //eslint-disable-next-line
    export interface ColumnInstance<D extends object = {}>
      extends UseFiltersColumnProps<D>,
        UseGroupByColumnProps<D>,
        UseResizeColumnsColumnProps<D>,
        UseSortByColumnProps<D> {}
  
        //eslint-disable-next-line
    export interface Cell<D extends object = {}, V = any>
      extends UseGroupByCellProps<D>,
        UseRowStateCellProps<D> {}
  
   //eslint-disable-next-line
        export interface Row<D extends object = {}>
      extends UseExpandedRowProps<D>,
        UseGroupByRowProps<D>,
        UseRowSelectRowProps<D>,
        UseRowStateRowProps<D> {}
  }