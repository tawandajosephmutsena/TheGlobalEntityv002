import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormField {
    type: 'text' | 'email' | 'number' | 'textarea' | 'tel' | 'city' | 'address' | 'select';
    label: string;
    required: boolean;
    placeholder?: string;
    name: string;
    options?: string[];
}

interface DynamicFormProps {
    title?: string;
    description?: string;
    fields: FormField[];
    submitText?: string;
    successMessage?: string;
    adminEmail?: string;
    replyToEmail?: string;
    confirmationEmailBody?: string;
    allowMultipleSubmissions?: boolean;
    className?: string;
}

export default function DynamicForm({
    title,
    description,
    fields = [],
    submitText = 'Submit',
    successMessage = 'Thank you for your submission!',
    adminEmail,
    replyToEmail,
    confirmationEmailBody,
    allowMultipleSubmissions,
    className
}: DynamicFormProps) {
    const initialData: Record<string, string> = {};
    if (title) {
        initialData.form_title = title;
    }
    if (adminEmail) {
        initialData.admin_email = adminEmail;
    }
    if (replyToEmail) {
        initialData.reply_to_email = replyToEmail;
    }
    if (confirmationEmailBody) {
        initialData.confirmation_email_body = confirmationEmailBody;
    }
    if (allowMultipleSubmissions !== undefined) {
        initialData.allow_multiple_submissions = String(allowMultipleSubmissions);
    }
    if (typeof window !== 'undefined') {
        initialData.page_title = document.title;
        initialData.page_url = window.location.href;
    }
    fields.forEach(field => {
        initialData[field.name || field.label.toLowerCase().replace(/\s+/g, '_')] = '';
    });

    const { data, setData, post, processing, reset, errors } = useForm(initialData);

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(successMessage);
                setSubmitted(true);
                reset();
            },
            onError: () => {
                toast.error('There was an error submitting the form. Please check the fields.');
            }
        });
    };

    if (submitted) {
        return (
            <div className={cn("text-center p-12 bg-agency-accent/5 rounded-3xl border border-agency-accent/20", className)}>
                <div className="size-16 bg-agency-accent rounded-full flex items-center justify-center mx-auto mb-6 text-agency-primary">
                    <Send className="size-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{successMessage}</h3>
                <p className="text-muted-foreground mb-8">We've received your information and will get back to you shortly.</p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>Send another message</Button>
            </div>
        );
    }

    return (
        <div className={cn("bg-white dark:bg-agency-dark rounded-3xl border border-border p-8 md:p-12 shadow-2xl shadow-black/5", className)}>
            {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
            {description && <p className="text-muted-foreground mb-8">{description}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map((field, index) => {
                        const fieldName = field.name || field.label.toLowerCase().replace(/\s+/g, '_');
                        const isFullWidth = field.type === 'textarea' || field.type === 'address';

                        return (
                            <div key={index} className={cn("space-y-2", isFullWidth && "md:col-span-2")}>
                                <Label htmlFor={fieldName} className="text-xs uppercase tracking-widest font-bold">
                                    {field.label} {field.required && <span className="text-agency-accent">*</span>}
                                </Label>
                                
                                {field.type === 'textarea' ? (
                                    <Textarea
                                        id={fieldName}
                                        value={data[fieldName]}
                                        onChange={e => setData(fieldName, e.target.value)}
                                        placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}...`}
                                        required={field.required}
                                        className="bg-muted/30 border-none min-h-[120px] focus-visible:ring-agency-accent"
                                    />
                                ) : field.type === 'select' ? (
                                    <div className="relative">
                                        <select
                                            id={fieldName}
                                            value={data[fieldName]}
                                            onChange={e => setData(fieldName, e.target.value)}
                                            required={field.required}
                                            title={field.label}
                                            className="w-full bg-muted/30 border-none h-12 px-4 rounded-md focus:ring-2 focus:ring-agency-accent appearance-none transition-colors"
                                        >
                                            <option value="" disabled>{field.placeholder || `Select ${field.label.toLowerCase()}...`}</option>
                                            {field.options?.map((option, i) => (
                                                <option key={i} value={option}>{option}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-muted-foreground">
                                            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <Input
                                        id={fieldName}
                                        type={field.type === 'city' || field.type === 'address' ? 'text' : field.type}
                                        value={data[fieldName]}
                                        onChange={e => setData(fieldName, e.target.value)}
                                        placeholder={field.placeholder || `Your ${field.label.toLowerCase()}...`}
                                        required={field.required}
                                        className="bg-muted/30 border-none h-12 focus-visible:ring-agency-accent"
                                    />
                                )}
                                {errors[fieldName] && <p className="text-xs text-destructive">{errors[fieldName]}</p>}
                            </div>
                        );
                    })}
                </div>

                <Button 
                    type="submit" 
                    disabled={processing} 
                    className="w-full h-14 bg-agency-primary text-agency-secondary font-black uppercase tracking-widest text-lg rounded-2xl hover:scale-[1.02] transition-transform shadow-xl mt-4"
                >
                    {processing ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        submitText
                    )}
                </Button>
            </form>
        </div>
    );
}
