import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input"

interface FormFieldPropsType<T extends FieldValues>{
  control: Control<T>; 
  name: Path<T>; 
  label: string; 
  placeholder?: string;
  type ?: "text" | "email" | "password"; 
}

const FormField = <T extends FieldValues>({
  control, 
  name, 
  label, 
  placeholder, 
  type="text"
} : FormFieldPropsType<T>) => {
  
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="label">{label}</FormLabel>
          <FormControl>
            <Input
              className="input"
              type={type}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/**
 * Instead of using the control functionality in the FormField, 
 * we will start using React Hook Form controller.  
 * This makes the component so much more reusable. 
 * 
 * T is a generic type that extends FieldValues,
 * allowing us to use this component with any form data structure.
 */

export default FormField; 