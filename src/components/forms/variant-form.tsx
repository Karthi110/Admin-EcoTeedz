"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../ui/form";
import { Input } from "../ui/input";
import { variantProps } from "./product-form";

const VariantForm = ({
  variant,
  setVariant,
  getNewOption,
}: {
  variant: variantProps[];
  setVariant: Dispatch<SetStateAction<variantProps[]>>;
  getNewOption: (data: variantProps[]) => void;
}) => {
  const [type, setType] = useState<string>("");
  const [option, setOption] = useState<string>("");
  const [values, setValues] = useState<string[]>([]);

  const removeValue = (index: number) => {
    const filteredOpts = values.filter((opt) => opt !== values[index]);
    setValues(filteredOpts);
  };

  const createVariant = () => {
    const data = [...variant];
    data.push({ name: type, options: values });
    setVariant(data);
    setType("");
    setValues([]);
    getNewOption(data);
  };

  const formSchema = z.object({
    type: z.string().min(2, {
      message: "Type must be at least 2 characters.",
    }),
    option: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      option: "",
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-fit">
          <PlusCircle size={20} />
          Add Variant
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a New Variant</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the type and values of variant type.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="grid grid-cols-1 gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => {})}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name"
                        {...field}
                        onChange={(e) => setType(e.target.value)}
                        value={type}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="option"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="opt">Options</FormLabel>
                    {values.length !== 0 ? (
                      <div className="grid grid-cols-3 auto-cols-min gap-4">
                        {values.map((opt, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <X
                              className="hover:text-destructive"
                              onClick={() => removeValue(i)}
                            />
                            <Input value={opt} disabled />
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <FormControl>
                      <div className="grid grid-cols-5 gap-2">
                        <Input
                          id="opt"
                          placeholder="value"
                          className="col-span-4"
                          {...field}
                          value={option}
                          onChange={(e) => setOption(e.target.value)}
                        />
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            setValues((prev) => [...prev, option]);
                            setOption("");
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => createVariant()}>
                  Create
                </AlertDialogAction>
              </div>
            </form>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VariantForm;
