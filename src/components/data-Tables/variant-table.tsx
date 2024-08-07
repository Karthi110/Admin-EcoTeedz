"use client";
import { ChevronRight, X, Ellipsis } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { generateCombinations } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { optionProps, variantProps } from "../forms/product-form";
import VariantForm from "../forms/variant-form";

interface PageProps {
  variant: variantProps[];
  setVariant: Dispatch<SetStateAction<variantProps[]>>;
  options: optionProps[];
  setOptions: Dispatch<SetStateAction<optionProps[]>>;
}

const VariantTable = ({
  options,
  setOptions,
  setVariant,
  variant,
}: PageProps) => {
  const getNewOptions = (data: variantProps[]) => {
    setOptions([]);
    if (data?.length !== 0) {
      let arrays: string[][] = [];
      data?.map((d) => arrays.push(d.options));
      let output = generateCombinations(arrays);
      output.map((opt) =>
        setOptions((prev) => [...prev, { option: opt, price: 0, inventory: 0 }])
      );
    }
  };

  const removeOption = (i: number) => {
    const filtered = options.filter((opt) => opt.option !== options[i].option);
    setOptions(filtered);
    if (filtered.length === 0) {
      setVariant([]);
    }
  };

  const handleInventory = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const newOptions = [...options];
    const inv = newOptions[i];
    inv.inventory = Number(e.target.value);
    setOptions(newOptions);
  };
  const handlePrice = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const newOptions = [...options];
    const pr = newOptions[i];
    pr.price = Number(e.target.value);
    setOptions(newOptions);
  };

  return (
    <Card>
      <CardHeader>Variant Details</CardHeader>
      <CardContent className="grid gap-2">
        <VariantForm
          setVariant={setVariant}
          getNewOption={getNewOptions}
          variant={variant}
        />
        {variant.length !== 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="flex">
                  {variant.length !== 0
                    ? variant.map((v, i) => (
                        <span key={i} className="mt-2 py-1 flex">
                          {v.name} <ChevronRight size={20} />
                        </span>
                      ))
                    : null}
                </TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[60px]">
                  <Ellipsis size={26} />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {options.length !== 0
                ? options.map((opt, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold flex items-center p-1">
                        {opt.option.map((o, idx) => (
                          <span
                            key={idx}
                            className="flex items-center justify-center mt-3"
                          >
                            {o}
                            <ChevronRight size={20} />
                          </span>
                        ))}
                      </TableCell>
                      <TableCell>
                        <Label htmlFor={`inv${i}`} className="sr-only">
                          Stock
                        </Label>
                        <Input
                          id={`inv${i}`}
                          type="number"
                          placeholder="1"
                          onChange={(e) => handleInventory(e, i)}
                          value={opt.inventory}
                        />
                      </TableCell>
                      <TableCell>
                        <Label htmlFor={`price${i}`} className="sr-only">
                          Price
                        </Label>
                        <Input
                          id={`price${i}`}
                          type="number"
                          placeholder="0.00"
                          onChange={(e) => handlePrice(e, i)}
                          value={opt.price}
                        />
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <X
                                size={24}
                                className="hover:text-destructive"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeOption(i);
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              Delete option
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default VariantTable;
