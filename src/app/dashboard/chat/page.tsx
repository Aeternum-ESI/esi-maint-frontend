"use client";

import { useChat } from "@ai-sdk/react";
import { MessageList } from "@/components/ui/chat/message-list";
import { MessageInput } from "@/components/ui/chat/message-input";
import { ChatContainer, ChatForm, ChatMessages } from "@/components/ui/chat/chat";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type DataSourceKey = 'STATS' | 'ASSETS' | 'REPORTS' | 'USERS' | 'INTERVENTIONS';

// Define available data sources
const DATA_SOURCES = {
    STATS: {
        overview: '/api/stats/overview',
        assets: {
            byStatus: '/api/stats/assets/by-status',
            byType: '/api/stats/assets/by-type',
            byCategory: '/api/stats/assets/by-category'
        },
        reports: {
            byStatus: '/api/stats/reports/by-status',
            byPriority: '/api/stats/reports/by-priority',
            byType: '/api/stats/reports/by-type',
            avgResolutionTime: '/api/stats/reports/avg-resolution-time'
        },
        technicians: {
            stats: '/api/stats/technicians/stats',
            top: '/api/stats/technicians/top'
        }
    },
    ASSETS: '/api/assets',
    REPORTS: '/api/reports',
    USERS: '/api/users',
    INTERVENTIONS: '/api/intervention-requests'
} as const;

const DATA_SOURCES_LIST: { value: DataSourceKey; label: string }[] = [
    { value: 'STATS', label: 'Statistics' },
    { value: 'ASSETS', label: 'Assets' },
    { value: 'REPORTS', label: 'Reports' },
    { value: 'USERS', label: 'Users' },
    { value: 'INTERVENTIONS', label: 'Interventions' },
];

export default function ChatDemo() {
    const [selectedData, setSelectedData] = useState<DataSourceKey[]>([]);
    const [open, setOpen] = useState(false);
    
    const { messages, input, handleInputChange, handleSubmit, status, stop } = useChat({
        experimental_throttle: 50,
        body: {
            selectedSources: selectedData
        }
    });

    // Handle form submission with selected data
    const handleFormSubmit = async (event?: { preventDefault?: () => void }, options?: { experimental_attachments?: FileList }) => {
        event?.preventDefault?.();
        handleSubmit(event, options);
    };

    const transcribeAudio = async (blob: Blob): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append('audio', blob, 'recording.webm');
            
            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Transcription failed');
            }

            const data = await response.json();
            return data.transcription;
        } catch (error) {
            console.error('Error transcribing audio:', error);
            return 'Sorry, there was an error transcribing your audio.';
        }
    };

    return (
        <div className="flex flex-col h-full mx-4 p-4 max-h-[calc(100vh-4rem)]">
            <div className="border-b px-6 py-4 bg-white">
                <h2 className="text-xl font-semibold">Chat Assistant</h2>
            </div>
            <div className="flex-1 overflow-auto rounded-t-lg border bg-background ">
                <div className="h-full overflow-auto p-2    ">
                    <ChatContainer className="min-h-full">
                        {!(messages.length == 0) ? (
                            <ChatMessages messages={messages as any}>
                                <MessageList messages={messages as any} isTyping={status === "submitted"} />
                            </ChatMessages>
                        ) : null}
                    </ChatContainer>
                </div>
            </div>

            <div className="border-x border-b rounded-b-lg bg-background">
                <ChatForm
                    className="p-4"
                    isPending={status === "submitted"}
                    handleSubmit={handleFormSubmit}
                >
                    {({ files, setFiles }) => (
                        <div className="space-y-4">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between"
                                    >
                                        {selectedData.length === 0
                                            ? "Select data to include..."
                                            : `${selectedData.length} source${selectedData.length === 1 ? '' : 's'} selected`}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search data sources..." />
                                        <CommandEmpty>No data source found.</CommandEmpty>
                                        <CommandGroup>
                                            {DATA_SOURCES_LIST.map((source) => (
                                                <CommandItem
                                                    key={source.value}
                                                    onSelect={() => {
                                                        setSelectedData(prev =>
                                                            prev.includes(source.value)
                                                                ? prev.filter(item => item !== source.value)
                                                                : [...prev, source.value]
                                                        );
                                                    }}
                                                >
                                                    {source.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            selectedData.includes(source.value) ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            
                            {selectedData.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedData.map((source) => (
                                        <span
                                            key={source}
                                            className="px-2 py-1 text-sm bg-persian-green/10 text-persian-green rounded-md"
                                        >
                                            {DATA_SOURCES_LIST.find(s => s.value === source)?.label}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <MessageInput
                                value={input}
                                onChange={handleInputChange}
                                allowAttachments
                                files={files}
                                setFiles={setFiles}
                                stop={stop}
                                isGenerating={status === "streaming"}
                                transcribeAudio={transcribeAudio}
                            />
                        </div>
                    )}
                </ChatForm>
            </div>
        </div>
    );
}