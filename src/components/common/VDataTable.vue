<script setup lang="ts" generic="T">
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FlexRender,
} from '@tanstack/vue-table'
import type { ColumnDef } from '@tanstack/vue-table'
interface Props<T> {
  data: T[]
  columns: ColumnDef<T>[]
  pageSize?: number
  pageSizeOptions?: number[]
  showEntriesPerPage?: boolean
  showPagination?: boolean
}
const props = withDefaults(defineProps<Props<T>>(), {
  pageSize: 10,
  pageSizeOptions: () => [5, 10, 20, 50],
  showEntriesPerPage: true,
  showPagination: true,
})
const table = useVueTable<T>({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  initialState: {
    pagination: {
      pageSize: props.pageSize,
    },
  },
})
</script>

<template>
  <div class="bg-white rounded-lg overflow-hidden">
    <div class="overflow-x-auto border border-gray-300 rounded-lg">
      <table class="w-full">
        <thead>
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="border-b border-gray-200"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="px-6 py-4 text-left text-sm font-medium text-gray-700"
            >
              <div
                v-if="!header.isPlaceholder"
                class="flex items-center gap-2 cursor-pointer select-none"
                @click="
                  header.column.getToggleSortingHandler
                    ? header.column.getToggleSortingHandler()
                    : null
                "
              >
                <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                <span v-if="header.column.getIsSorted">
                  <span v-if="header.column.getIsSorted() === 'asc'">▲</span>
                  <span v-else-if="header.column.getIsSorted() === 'desc'">▼</span>
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :class="
                cell.column.id === 'actions' ? 'px-4 py-4' : 'px-6 py-4 text-sm text-gray-600'
              "
            >
              <slot name="cell" :column="cell.column" :cell="cell" :row="row">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </slot>
            </td>
          </tr>
          <tr v-if="table.getRowModel().rows.length === 0">
            <td :colspan="columns.length" class="px-6 py-8 text-center text-sm text-gray-500">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="showPagination"
      class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 py-4 bg-white border-t border-gray-200"
    >
      <div class="text-sm text-gray-600">
        Showing
        {{ table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 }}
        to
        {{
          Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )
        }}
        of {{ table.getFilteredRowModel().rows.length }} entries
      </div>

      <div class="flex flex-wrap items-center justify-center gap-3">
        <!-- Page navigation -->
        <div class="flex items-center gap-1">
          <button
            @click="table.setPageIndex(0)"
            :disabled="!table.getCanPreviousPage()"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="First page"
          >
            «
          </button>
          <button
            @click="table.previousPage()"
            :disabled="!table.getCanPreviousPage()"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="Previous page"
          >
            ‹
          </button>
          <span class="px-4 py-1.5 text-sm text-gray-600">
            Page {{ table.getState().pagination.pageIndex + 1 }} of
            {{ table.getPageCount() }}
          </span>
          <button
            @click="table.nextPage()"
            :disabled="!table.getCanNextPage()"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="Next page"
          >
            ›
          </button>
          <button
            @click="table.setPageIndex(table.getPageCount() - 1)"
            :disabled="!table.getCanNextPage()"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="Last page"
          >
            »
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
