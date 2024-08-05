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
import { DrawerClose } from "../ui/drawer";
import { FormSchema } from "@/lib/formSchemas";
import { Textarea } from "../ui/textarea";
import ImageUploader from "../image-uploader";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/db/actions";

export function UserForm() {
  const queryClient = useQueryClient();
  const [imgUrl, setImgUrl] = useState<string>("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: "",
      email: "",
      modile: "",
      name: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer created");
    },
    onError: ({ message }) => toast.error(message),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate({
      name: data.name,
      email: data.email,
      address: data.address,
      mobile: data.modile,
      avatarUrl: imgUrl,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[70%] space-y-6 rounded-md border-2 p-4"
      >
        <div className="grid grid-cols-3 gap-4">
          <ImageUploader imgUrl={imgUrl} setImgUrl={setImgUrl} />
          <div className="grid grid-cols-1 gap-2 col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modile</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="modile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full gap-2 items-center justify-center">
              <DrawerClose asChild>
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DrawerClose>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
