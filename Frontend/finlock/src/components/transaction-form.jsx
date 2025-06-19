import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Loader2, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation,useNavigate } from 'react-router-dom';
import { ReceiptScanner } from './receiptScanner';
// Theme styles configuration
const themeStyles = {
    dark: {
        background: 'bg-[#0F0F1C]',
        card: 'bg-[#1C1C2E]/90 border-[#2D2D40]/60',
        input: 'bg-[#202030] border-[#3A3A55] text-white placeholder-gray-400 focus:ring-purple-500',
        text: {
            primary: 'text-white',
            secondary: 'text-gray-400',
            muted: 'text-gray-500'
        },
        decorativeOrbs: {
            first: 'bg-purple-600/30',
            second: 'bg-pink-500/30',
            third: 'bg-indigo-500/30'
        },
        divider: 'border-[#2E2E3A]',
        dividerBg: 'bg-[#1A1A2E]'
    },
    light: {
        background: 'bg-gradient-to-br from-white via-slate-50 to-white',
        card: 'bg-white/70 border-slate-200/70',
        input: 'bg-white border-slate-300 text-gray-900 placeholder-gray-400 focus:ring-violet-500',
        text: {
            primary: 'text-gray-900',
            secondary: 'text-gray-600',
            muted: 'text-gray-500'
        },
        decorativeOrbs: {
            first: 'bg-purple-200/30',
            second: 'bg-pink-200/30',
            third: 'bg-blue-200/30'
        },
        divider: 'border-slate-300',
        dividerBg: 'bg-white'
    }
};

// Custom Button Component
const Button = ({ children, variant = 'primary', className = '', disabled = false, onClick, type = 'button', theme = 'light', ...props }) => {
    const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: theme === 'dark'
            ? 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500'
            : 'bg-violet-600 hover:bg-violet-700 text-white focus:ring-violet-500',
        outline: theme === 'dark'
            ? 'border border-[#3A3A55] bg-[#202030] hover:bg-[#2A2A3A] text-gray-300 focus:ring-purple-500'
            : 'border border-slate-300 bg-white hover:bg-slate-50 text-gray-700 focus:ring-violet-500',
        ghost: theme === 'dark'
            ? 'text-gray-300 hover:bg-[#2A2A3A] focus:ring-purple-500'
            : 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
    };

    return (
        <button
            type={type}
            className={`${baseClasses} ${variants[variant]} ${className}`}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

// Custom Input Component
const Input = ({ className = '', error = false, theme = 'light', ...props }) => {
    const currentTheme = themeStyles[theme];
    const inputClasses = `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${currentTheme.input
        } ${error ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : ''}`;

    return (
        <input
            className={`${inputClasses} ${className}`}
            {...props}
        />
    );
};

// Custom Select Component
const Select = ({ children, value, onChange, placeholder, className = '', theme = 'light' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || '');
    const [selectedLabel, setSelectedLabel] = useState(placeholder || 'Select...');
    const currentTheme = themeStyles[theme];
    useEffect(() => {
        setSelectedValue(value || '');
        // Update label when value changes
        if (value) {
            const child = React.Children.toArray(children).find(child => 
                React.isValidElement(child) && child.props.value === value
            );
            if (child) {
                setSelectedLabel(child.props.children);
            }
        } else {
            setSelectedLabel(placeholder || 'Select...');
        }
    }, [value, children, placeholder]);

    const handleSelect = (optionValue, optionLabel) => {
        setSelectedValue(optionValue);
        setSelectedLabel(optionLabel);
        setIsOpen(false);
        if (onChange) {
            onChange(optionValue);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                className={`w-full px-3 py-2 text-left border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent flex items-center justify-between ${currentTheme.input}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={selectedValue ? currentTheme.text.primary : currentTheme.text.muted}>
                    {selectedValue ? selectedLabel : placeholder}
                </span>
                <ChevronDown className={`h-4 w-4 ${currentTheme.text.muted}`} />
            </button>

            {isOpen && (
                <div className={`absolute z-10 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-auto ${currentTheme.card}`}>
                    {React.Children.map(children, (child, index) => {
                        if (React.isValidElement(child) && child.type === SelectItem) {
                            return React.cloneElement(child, {
                                key: child.props.value || `select-item-${index}`,
                                onSelect: handleSelect,
                                isSelected: selectedValue === child.props.value,
                                theme: theme
                            });
                        }
                        return child;
                    })}
                </div>
            )}
        </div>
    );
};

const SelectItem = ({ value, children, onSelect, isSelected, theme = 'light' }) => {
    const currentTheme = themeStyles[theme];
    const hoverBg = theme === 'dark' ? 'hover:bg-[#2A2A3A]' : 'hover:bg-slate-100';
    const selectedBg = theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-violet-50 text-violet-600';

    return (
        <button
            type="button"
            className={`w-full px-3 py-2 text-left ${hoverBg} focus:outline-none ${isSelected ? selectedBg : currentTheme.text.primary
                }`}
            onClick={() => onSelect(value, children)}
        >
            {children}
        </button>
    );
};

// Custom Switch Component
const Switch = ({ checked, onChange, theme = 'light' }) => {
    const bgColor = checked
        ? (theme === 'dark' ? 'bg-purple-600' : 'bg-violet-600')
        : (theme === 'dark' ? 'bg-[#3A3A55]' : 'bg-gray-200');

    const focusRing = theme === 'dark' ? 'focus:ring-purple-500' : 'focus:ring-violet-500';

    return (
        <button
            type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${bgColor} ${focusRing}`}
            onClick={() => onChange(!checked)}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );
};

// Custom Calendar Component
const SimpleCalendar = ({ selectedDate, onDateSelect, onClose, theme = 'light' }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const currentTheme = themeStyles[theme];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date) => {
        return selectedDate && date.toDateString() === selectedDate.toDateString();
    };

    const days = getDaysInMonth(currentMonth);
    const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const buttonHover = theme === 'dark' ? 'hover:bg-[#2A2A3A]' : 'hover:bg-slate-100';
    const selectedBg = theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-violet-600 text-white';
    const todayBg = theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-violet-100 text-violet-600';

    return (
        <div className={`absolute z-20 mt-1 p-4 border rounded-md shadow-lg ${currentTheme.card}`}>
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className={`p-1 ${buttonHover} rounded ${currentTheme.text.primary}`}
                >
                    ←
                </button>
                <h3 className={`font-semibold ${currentTheme.text.primary}`}>{monthYear}</h3>
                <button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className={`p-1 ${buttonHover} rounded ${currentTheme.text.primary}`}
                >
                    →
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className={`p-2 text-sm font-medium text-center ${currentTheme.text.muted}`}>
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => (
                    <div key={`day-${index}`} className="p-1">
                        {date && (
                            <button
                                type="button"
                                onClick={() => {
                                    onDateSelect(date);
                                    onClose();
                                }}
                                className={`w-8 h-8 text-sm rounded ${buttonHover} ${isSelected(date) ? selectedBg :
                                    isToday(date) ? todayBg :
                                        currentTheme.text.primary
                                    }`}
                            >
                                {date.getDate()}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main Transaction Form Component
export default function AddTransactionForm({
    accounts = [
        { _id: '1', name: 'Checking Account', balance: 1000, isDefault: true },
        { _id: '2', name: 'Savings Account', balance: 5000, isDefault: false }
    ],
    categories = [
        { id: 'food', name: 'Food & Dining', type: 'EXPENSE' },
        { id: 'transport', name: 'Transportation', type: 'EXPENSE' },
        { id: 'salary', name: 'Salary', type: 'INCOME' },
        { id: 'freelance', name: 'Freelance', type: 'INCOME' }
    ],
    editMode = false,
    initialData = null,
    onSubmit: onFormSubmit = () => {},
    theme = 'light'
}) {
    const [formData, setFormData] = useState({
        type: 'EXPENSE',
        amount: '',
        description: '',
        accountId: accounts.find(ac => ac.isDefault)?._id || accounts[0]?._id || '',
        category: '',
        date: new Date(),
        isRecurring: false,
        recurringInterval: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const currentTheme = themeStyles[theme];
     const origin = location.state?.from || '/dashboard';
    // Initialize form with edit data
    useEffect(() => {
        if (editMode && initialData) {
            setFormData({
                type: initialData.type,
                amount: initialData.amount.toString(),
                description: initialData.description,
                accountId: initialData.accountId,
                category: initialData.category,
                date: new Date(initialData.date),
                isRecurring: initialData.isRecurring,
                recurringInterval: initialData.recurringInterval || ''
            });
        }
        // console.log("initialData: ",initialData);
    }, [editMode, initialData]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.type) newErrors.type = 'Type is required';
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }
        if (!formData.accountId) newErrors.accountId = 'Account is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (formData.isRecurring && !formData.recurringInterval) {
            newErrors.recurringInterval = 'Recurring interval is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setApiError('');

        try {
            const submitData = {
                ...formData,
                amount: parseFloat(formData.amount),
                date: formData.date.toISOString(),
                recurringInterval: formData.isRecurring ? formData.recurringInterval : null
            };

            if (editMode && initialData?._id) {
                // Update existing transaction
                const response = await axios.put(`/api/v1/transaction/${initialData._id}`, submitData);
                //console.log('Transaction updated:', response.data);
                toast.success("Transaction updated");
                navigate(origin);
            } else {
                // Create new transaction
                // console.log("Submitting transaction payload:", submitData);
                const response = await axios.post('/api/v1/transaction', submitData);
                //console.log('Transaction created:', response.data);
                toast.success("Transaction created");
                navigate(origin);
            }

            // Call parent onSubmit callback if provided
            if (onFormSubmit) {
                await onFormSubmit(submitData);
            }

            // Reset form if not in edit mode
            if (!editMode) {
                setFormData({
                    type: 'EXPENSE',
                    amount: '',
                    description: '',
                    accountId: accounts.find(ac => ac.isDefault)?._id || accounts[0]?._id || '',
                    category: '',
                    date: new Date(),
                    isRecurring: false,
                    recurringInterval: ''
                });
            }

        } catch (error) {
            console.error('API Error:', error);
            
            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                const message = error.response.data?.message || error.response.data?.error || 'Server error occurred';
                setApiError(message);
            } else if (error.request) {
                // Request was made but no response received
                setApiError('Network error. Please check your connection.');
            } else {
                // Something else happened
                setApiError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        // Clear API error when user starts typing
        if (apiError) {
            setApiError('');
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const filteredCategories = categories.filter(
        category => category.type === formData.type
    );
    
    const handleScanComplete = (scannedData) => {
    if (!scannedData) return;

    setFormData(prev => ({
        ...prev,
        amount: scannedData.amount ? scannedData.amount.toString() : prev.amount,
        date: scannedData.date ? new Date(scannedData.date) : prev.date,
        description: scannedData.description || prev.description,
        category: scannedData.category || prev.category
    }));

    toast.success("Receipt scanned successfully");
};

    return (
        <div className={`min-h-screen ${currentTheme.background}`}>
            {/* Decorative background orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${currentTheme.decorativeOrbs.first} blur-3xl`}></div>
                <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full ${currentTheme.decorativeOrbs.second} blur-3xl`}></div>
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full ${currentTheme.decorativeOrbs.third} blur-3xl`}></div>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto p-6">
                <div className={`backdrop-blur-xl rounded-2xl border shadow-2xl p-8 ${currentTheme.card}`}>
                    <div className="space-y-6">
                        {/* API Error Display */}
                        {apiError && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <X className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-800">{apiError}</p>
                                    </div>
                                    <div className="ml-auto pl-3">
                                        <button
                                            type="button"
                                            onClick={() => setApiError('')}
                                            className="inline-flex text-red-400 hover:text-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

                        {/* Type */}
                        <div className="space-y-2">
                            <label className={`text-sm font-medium ${currentTheme.text.primary}`}>Type</label>
                            <Select
                                value={formData.type}
                                onChange={(value) => {
                                    handleInputChange('type', value);
                                    // Reset category when type changes
                                    handleInputChange('category', '');
                                }}
                                placeholder="Select type"
                                theme={theme}
                            >
                                <SelectItem value="EXPENSE">Expense</SelectItem>
                                <SelectItem value="INCOME">Income</SelectItem>
                            </Select>
                            {errors.type && (
                                <p className="text-sm text-red-500">{errors.type}</p>
                            )}
                        </div>

                        {/* Amount and Account */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${currentTheme.text.primary}`}>Amount</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => handleInputChange('amount', e.target.value)}
                                    error={!!errors.amount}
                                    theme={theme}
                                />
                                {errors.amount && (
                                    <p className="text-sm text-red-500">{errors.amount}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${currentTheme.text.primary}`}>Account</label>
                                <Select
                                    value={formData.accountId}
                                    onChange={(value) => handleInputChange('accountId', value)}
                                    placeholder="Select account"
                                    theme={theme}
                                >
                                    {accounts.map((account) => (
                                        <SelectItem key={account._id} value={account._id}>
                                            {`${account.name} ($${parseFloat(account.balance || 0).toFixed(2)})`}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {errors.accountId && (
                                    <p className="text-sm text-red-500">{errors.accountId}</p>
                                )}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className={`text-sm font-medium ${currentTheme.text.primary}`}>Category</label>
                            <Select
                                value={formData.category}
                                onChange={(value) => handleInputChange('category', value)}
                                placeholder="Select category"
                                theme={theme}
                            >
                                {filteredCategories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </Select>
                            {errors.category && (
                                <p className="text-sm text-red-500">{errors.category}</p>
                            )}
                        </div>

                        {/* Date */}
                        <div className="space-y-2 relative">
                            <label className={`text-sm font-medium ${currentTheme.text.primary}`}>Date</label>
                            <button
                                type="button"
                                onClick={() => setShowCalendar(!showCalendar)}
                                className={`w-full px-3 py-2 text-left border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent flex items-center justify-between ${currentTheme.input}`}
                            >
                                <span className={formData.date ? currentTheme.text.primary : currentTheme.text.muted}>
                                    {formData.date ? formatDate(formData.date) : 'Pick a date'}
                                </span>
                                <Calendar className={`h-4 w-4 ${currentTheme.text.muted}`} />
                            </button>

                            {showCalendar && (
                                <SimpleCalendar
                                    selectedDate={formData.date}
                                    onDateSelect={(date) => handleInputChange('date', date)}
                                    onClose={() => setShowCalendar(false)}
                                    theme={theme}
                                />
                            )}

                            {errors.date && (
                                <p className="text-sm text-red-500">{errors.date}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className={`text-sm font-medium ${currentTheme.text.primary}`}>Description</label>
                            <Input
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                theme={theme}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description}</p>
                            )}
                        </div>

                        {/* Recurring Toggle */}
                        <div className={`flex flex-row items-center justify-between rounded-lg border p-4 ${currentTheme.card}`}>
                            <div className="space-y-0.5">
                                <label className={`text-base font-medium ${currentTheme.text.primary}`}>Recurring Transaction</label>
                                <div className={`text-sm ${currentTheme.text.secondary}`}>
                                    Set up a recurring schedule for this transaction
                                </div>
                            </div>
                            <Switch
                                checked={formData.isRecurring}
                                onChange={(checked) => handleInputChange('isRecurring', checked)}
                                theme={theme}
                            />
                        </div>

                        {/* Recurring Interval */}
                        {formData.isRecurring && (
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${currentTheme.text.primary}`}>Recurring Interval</label>
                                <Select
                                    value={formData.recurringInterval}
                                    onChange={(value) => handleInputChange('recurringInterval', value)}
                                    placeholder="Select interval"
                                    theme={theme}
                                >
                                    <SelectItem value="DAILY">Daily</SelectItem>
                                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                                    <SelectItem value="YEARLY">Yearly</SelectItem>
                                </Select>
                                {errors.recurringInterval && (
                                    <p className="text-sm text-red-500">{errors.recurringInterval}</p>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={()=> navigate(origin)}
                                theme={theme}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="w-full"
                                disabled={loading}
                                theme={theme}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {editMode ? "Updating..." : "Creating..."}
                                    </>
                                ) : editMode ? (
                                    "Update Transaction"
                                ) : (
                                    "Create Transaction"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}