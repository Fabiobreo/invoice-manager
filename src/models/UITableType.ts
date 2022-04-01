export type UITableType = {
  id: string;
  columns: Array<any>;
  data: Array<any>;
  isLoading: boolean;
  error: string | null;
  title: string;
  isShowAllVisible: boolean;
  onShowAll?: () => void;
  isAddNewVisible: boolean;
  onAddNew?: () => void;
  onRowClick: (row: any) => void;
  totalPages: number;
  currentPage: number;
  onChangePage?: (newPage: number) => void;
  showPagination: boolean;
  onSort?: (sort: { sortBy: string; sort: string }) => void;
};
