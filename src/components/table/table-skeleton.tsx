import { Skeleton } from "@kobalte/core";
import { For } from "solid-js";
import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/generic-table/table-style";
import "./skeleton.css"

export function TableRowSkeleton(props: { limits: number }) {
  return (
    <For each={Array.from({ length: props.limits }, (_, i) => i)}>
      {(item, idx) => (
        <TableRow id={idx.toString()} class="">
          <TableCell class="w-[100px]">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="flex flex-row items-center space-x-3">
                <img
                  class="h-[40px] w-[40px] rounded-full"
                  alt="nft collection avatar"
                />
                <div class="flex flex-col">
                  <div class="text-table">name</div>
                  <div class="text-table text-xs">
                    supply
                  </div>
                </div>
              </div>
            </Skeleton.Root>
          </TableCell>
          <TableCell>
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </TableCell>
          <TableCell>
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </TableCell>
          <TableCell class="text-right">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 NFTs</div>
            </Skeleton.Root>
          </TableCell>
          <TableCell class="text-right">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 NFTs</div>
            </Skeleton.Root>
          </TableCell>
          <TableCell class="text-right">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 NFTs</div>
            </Skeleton.Root>
          </TableCell>
          <TableCell class="text-right">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">10 NFTs</div>
            </Skeleton.Root>
          </TableCell>
        </TableRow>
      )}
    </For>
  );
}
