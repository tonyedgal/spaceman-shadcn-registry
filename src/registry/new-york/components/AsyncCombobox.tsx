import {
  useCallback,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  ReactNode,
} from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AsyncComboBoxProps<T> {
  placeholder: string;
  selected?: T;
  onChange: (data: T) => void;
  renderItem: (item: T, btn?: boolean) => ReactNode;
  getItemKey: (item: T) => string;
  onSearch: (query: string) => void;
  query: string;
  data: T[];
  isLoading: boolean;
  isError: boolean;
}

const AsyncComboBox = forwardRef(function AsyncComboBox<T>(
  {
    placeholder,
    selected,
    onChange,
    renderItem,
    getItemKey,
    onSearch,
    query,
    data,
    isLoading,
    isError,
  }: AsyncComboBoxProps<T>,
  ref: React.Ref<{ clear: () => void }>
) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<T | undefined>();

  const handleSetActive = useCallback(
    (item: T) => {
      setValue(item);
      setOpen(false);
      onChange(item);
    },
    [onChange]
  );

  useEffect(() => {
    if (!value && selected) setValue(selected);
  }, [selected, value]);

  const displayName = value
    ? renderItem(value)
    : `${placeholder ? `Select ${placeholder}...` : "Select ..."}`;

  useImperativeHandle(ref, () => ({
    clear: () => setValue(undefined),
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="flex h-9 w-full cursor-default items-center justify-between whitespace-nowrap rounded-sm 
              bg-neutral-700 py-2 pl-4 pr-2 text-left text-sm font-normal text-neutral-50 text-opacity-70 shadow-sm 
              transition-colors hover:bg-neutral-600 hover:text-neutral-50 focus-visible:outline-none focus-visible:ring-1 
              focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300"
        >
          {displayName}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto rounded-md border-none p-0">
        <Command
          shouldFilter={false}
          className="w-96 rounded-none bg-neutral-800 drop-shadow-xl"
        >
          <CommandInput
            placeholder={`Search ${placeholder}`}
            onValueChange={onSearch}
            className="text-neutral-200"
          />
          <ScrollArea className="max-h-72 w-96">
            <CommandGroup>
              {isLoading && <div className="p-4 text-sm">Searching...</div>}
              {!isError && !isLoading && !data?.length && query.length > 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              {isError && (
                <div className="p-4 text-sm">Something went wrong</div>
              )}

              {data.map((item) => (
                <CommandItem
                  key={getItemKey(item)}
                  value={getItemKey(item)}
                  onSelect={() => handleSetActive(item)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value && getItemKey(value) === getItemKey(item)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {renderItem(item, true)}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

AsyncComboBox.displayName = "AsyncComboBox";

export default AsyncComboBox;
