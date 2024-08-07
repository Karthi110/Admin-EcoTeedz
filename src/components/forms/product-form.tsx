"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { productSchema } from "@/lib/formSchemas";
import { Textarea } from "../ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";
import ImageUploader from "../image-uploader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "@/db/actions";
import { useRouter } from "next/navigation";
import { ProductStatus } from "@prisma/client";
import VariantTable from "../data-Tables/variant-table";

export interface variantProps {
  name: string;
  options: string[];
}

export interface optionProps {
  option: string[];
  inventory: number;
  price: number;
}

interface PageProps {
  product?: {
    id: string;
    title: string;
    description: string;
    media: string[];
    status: string;
    comparePrice: number | null;
    price: number;
    inventory: number;
  };
  variants?: variantProps[];
  variantOptions?: optionProps[];
}

export function ProductForm({ variantOptions, product, variants }: PageProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [variant, setVariant] = useState<variantProps[]>([]);
  const [options, setOptions] = useState<optionProps[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!loaded) {
      setVariant(variants || []);
      setOptions(variantOptions || []);
      setImgUrls(product?.media || []);
      setLoaded(true);
    }
  });

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || "",
      comparePrice: String(product?.comparePrice) || "",
      description: product?.description || "",
      inventory: String(product?.inventory) || "",
      price: String(product?.price) || "",
      status: product?.status as ProductStatus,
    },
  });

  const { mutate: create } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Product Created!");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      router.push("/products");
    },
    onError: ({ message }) => toast.error(message),
  });

  const { mutate: update } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success("Product Updated!");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      router.push("/products");
    },
    onError: ({ message }) => toast.error(message),
  });

  function onSubmit({
    description,
    inventory,
    price,
    status,
    title,
    comparePrice,
  }: z.infer<typeof productSchema>) {
    if (imgUrls.length === 0) {
      toast.error("Upload product images");
      return;
    }
    if (!product?.id) {
      create({
        comparePrice: comparePrice || "",
        description,
        inventory,
        price,
        status,
        title,
        media: imgUrls,
        options,
        variant,
      });
    } else {
      update({
        product: {
          id: product.id,
          comparePrice: Number(comparePrice),
          description,
          inventory: Number(inventory),
          price: Number(price),
          status,
          title,
          media: imgUrls,
        },
        options: options,
        variant: variant,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8"
      >
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                Provide product details to add them to store.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2 flex-col">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-32"
                        placeholder="Prdduct description....."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Price and Inventory Details</CardTitle>
              <CardDescription>
                Provide product and inventory details.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-y-4">
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="inventory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Inventory</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="w-1/3"
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1">
                      Product Price ( in <IndianRupee size={14} />)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-10/12"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comparePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1">
                      Product Compare Price ( in <IndianRupee size={14} />)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-10/12"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <VariantTable
            options={options}
            setOptions={setOptions}
            setVariant={setVariant}
            variant={variant}
          />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />{" "}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">draft</SelectItem>
                        <SelectItem value="ACTIVE">active</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload product images.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 items-center justify-center w-full">
                <div className="aspect-square w-[250px] rounded-md bg-muted">
                  <ImageUploader
                    imgUrl={imgUrls}
                    setImgUrl={setImgUrls}
                    type="product"
                  />
                </div>
                {/* TODO add image  */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square w-full rounded-md bg-muted" />
                  <div className="aspect-square w-full rounded-md bg-muted" />
                  <div className="aspect-square w-full rounded-md bg-background border-2 border-dashed flex items-center justify-center" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Button
          size="lg"
          className="text-lg ml-auto col-span-2"
          type="submit"
          disabled={imgUrls.length === 0}
        >
          Save Product
        </Button>
      </form>
    </Form>
  );
}
