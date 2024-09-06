"use client"
import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { productsData } from '@/helper/commonValues';
import { useDispatch, useSelector } from 'react-redux';
import { setCalcValues, setSelectedProducts, setSubTotal } from '@/store/slice/productSlice';

const AllProductsTable = () => {
    const dispatch = useDispatch()
    const [error, setError] = useState([]);
    const { selectedProducts, calcValues, subTotal } = useSelector(({ productSliceName }) => productSliceName);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: null, matchMode: FilterMatchMode.BETWEEN }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [representatives] = useState([
        { name: 'Amy Elsner', image: 'amyelsner.png' },
        { name: 'Anna Fali', image: 'annafali.png' },
        { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        { name: 'Onyama Limba', image: 'onyamalimba.png' },
        { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        { name: 'XuXue Feng', image: 'xuxuefeng.png' }
    ]);
    const [statuses] = useState(['unqualified', 'qualified', 'new', 'negotiation', 'renewal']);

    const getSeverity = (status) => {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warning';

            case 'renewal':
                return null;
        }
    };

    useEffect(() => {
        setCustomers(getCustomers(productsData))
    }, []);

    const getCustomers = (data) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            d.qty = Math.floor(Math.random() * 21);
            d.addText = 0;
            d.discount = 0;
            d.amount = 0;
            return d;
        });
    };

    const formatDate = (value) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                {/* <h4 className="m-0">Customers</h4> */}
                <IconField iconPosition="right" className='min-w-full min-h-10'>
                    <InputIcon className="pi pi-search" />
                    <InputText className='min-w-full h-10 p-5 text-white' value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
        );
    };

    const renderFooter = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0">Hii This is Footer</h4>
            </div>
        );
    };

    const countryBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <img alt="flag" src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} />
                <span>{rowData.country.name}</span>
            </div>
        );
    };

    const representativeBodyTemplate = (rowData) => {
        const representative = rowData.representative;

        return (
            <div className="flex align-items-center gap-2 max-w-1rem lg:max-w-1rem">
                <img alt={representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} style={{ maxWidth: "4rem" }} className="max-w-1rem lg:max-w-1rem shadow-2 border-round" />
                {/* <span>{representative.name}</span> */}
            </div>
        );
    };

    const representativeFilterTemplate = (options) => {
        return (
            <React.Fragment>
                <div className="mb-3 font-bold">Agent Picker</div>
                <MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />
            </React.Fragment>
        );
    };

    const representativesItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2 w-1rem lg:w-1rem">
                <img alt={option.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} style={{ maxWidth: "4rem" }} className="max-w-1rem lg:max-w-1rem shadow-2" />
                {/* <span>{option.name}</span> */}
            </div>
        );
    };

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.date);
    };

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const balanceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.balance);
    };

    const amountBody = (rowData) => {
        return parseFloat(rowData.amount).toFixed(2);
    };

    const balanceFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const statusFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const activityBodyTemplate = (rowData) => {
        return <ProgressBar value={rowData.activity} showValue={false} style={{ height: '6px' }}></ProgressBar>;
    };


    const activityFilterTemplate = (options) => {
        return (
            <>
                <Slider value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
                <div className="flex align-items-center justify-content-between px-2">
                    <span>{options.value ? options.value[0] : 0}</span>
                    <span>{options.value ? options.value[1] : 100}</span>
                </div>
            </>
        );
    }

    const actionBodyTemplate = (data) => {
        return <Button type="button" disabled={!data.addText || error[data.id]} icon="pi pi-plus-circle" className='action-icon-size p-5' onClick={(e) => {
            const updatedSelectedProducts = [...selectedProducts, data];
            const calSubTotal = parseFloat(updatedSelectedProducts?.reduce((total, product) => parseFloat(total || 0) + parseFloat(product.amount || 0), 0)).toFixed(2)
            const afterDiscount = parseFloat((calSubTotal - parseFloat((calcValues.discount * calSubTotal) / 100)));
            dispatch(setSelectedProducts(updatedSelectedProducts));
            dispatch(setSubTotal(
                calSubTotal
            ))
            dispatch(setCalcValues({
                ...calcValues,
                grandTotal: parseFloat(afterDiscount + parseFloat((calcValues.tax * afterDiscount) / 100)).toFixed(2)
            }))
        }}
            rounded></Button>;
    };

    const addTextBody = (data) => {
        const handleChange = (e) => {
            const value = parseInt(e.target.value || 0);
            const index = customers?.findIndex(customer => customer.id === data.id);
            const newCustomers = [...customers];
            const amount = value <= data.qty ? value * parseFloat(data.balance) : data.amount;
            const discount = value <= data.qty ? data.discount : 0;
            newCustomers[index] = { ...newCustomers[index], addText: value, amount: amount, discount: discount };
            setCustomers(newCustomers);
            setError(prevErrors => {
                const { [data.id]: currentErrors = {} } = prevErrors;
                const { addText, ...remainingErrors } = currentErrors;
                if (Object.keys(remainingErrors).length === 0) {
                    const { [data.id]: _, ...otherErrors } = prevErrors; // Remove `data.id` entry completely
                    return otherErrors;
                }
                return {
                    ...prevErrors,
                    [data.id]: remainingErrors
                };
            });
            if (value > data.qty) {
                setError(prevErrors => ({
                    ...prevErrors,
                    [data.id]: {
                        ...prevErrors[data.id],
                        addText: `Only ${data.qty} is Left`
                    }
                }));
            }

        };

        return (
            <>
                <InputText
                    keyfilter="int"
                    placeholder="Integers"
                    disabled={!data.qty || data.qty === 0}
                    value={data.addText === 0 ? "" : data.addText}
                    onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'minus') {
                            e.preventDefault();
                        }
                    }}
                    onChange={handleChange}
                    className={`h-10 p-3 ${error[data.id]?.addText ? 'border-red-500 border-2' : ''}`}
                />
                {error[data.id]?.addText && <p className="text-red-500 mt-1">{error[data.id]?.addText}</p>}
            </>
        );
    };

    const discountBody = (data) => {
        const handleChange = (e) => {
            const value = parseInt(e.target.value || 0);
            const index = customers?.findIndex(customer => customer.id === data.id);
            const newCustomers = [...customers];
            const ogAmt = parseInt(data.addText) * parseFloat(data.balance);
            const amount = value <= ogAmt ? ((ogAmt) - value).toFixed(2) : (ogAmt);
            newCustomers[index] = { ...newCustomers[index], discount: value, amount: amount };
            setCustomers(newCustomers);
            setError(prevErrors => {
                const { [data.id]: currentErrors = {} } = prevErrors;
                const { discount, ...remainingErrors } = currentErrors;
                if (Object.keys(remainingErrors).length === 0) {
                    const { [data.id]: _, ...otherErrors } = prevErrors; // Remove `data.id` entry completely
                    return otherErrors;
                }
                return {
                    ...prevErrors,
                    [data.id]: remainingErrors
                };
            });


            if (value > ogAmt) {
                setError(prevErrors => ({
                    ...prevErrors,
                    [data.id]: {
                        ...prevErrors[data.id],
                        discount: `Equal or Less Than ${ogAmt}`
                    }
                }));

            }

        };

        return (
            <>
                <InputText
                    keyfilter="int"
                    placeholder="Integers"
                    disabled={!data.qty || data.qty === 0 || !data.balance || !data.addText || error[data.id]?.addText}
                    value={data.discount === 0 ? "" : data.discount}
                    onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'minus') {
                            e.preventDefault();
                        }
                    }}
                    onBlur={handleChange}
                    onChange={(e) => {
                        const value = parseInt(e.target.value || 0);
                        const index = customers?.findIndex(customer => customer.id === data.id);
                        const newCustomers = [...customers];
                        newCustomers[index] = { ...newCustomers[index], discount: value };
                        setCustomers(newCustomers);
                    }}
                    className={`h-10 p-3 ${error[data.id]?.discount ? 'border-red-500 border-2' : ''}`}
                />
                {error[data.id]?.discount && <p className="text-red-500 mt-1">{error[data.id]?.discount}</p>}
            </>
        );
    };

    const header = renderHeader();
    const footer = renderFooter();
    // globalFilterValue === "" ? [] :
    return (
        <div className="card">
            <DataTable value={globalFilterValue === "" ? [] : customers?.filter((p) => !selectedProducts?.some(s => s.id === p.id))} paginator header={header} footer={footer} rows={10}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]} dataKey="id"
                // selectionMode="checkbox"
                //  selection={selectedCustomers} 
                //  onSelectionChange={(e) => {
                //     setSelectedCustomers(e.value)
                // }}
                filters={filters} filterDisplay="menu" globalFilterFields={['name', 'country.name', 'representative.name', 'balance', 'status']}
                emptyMessage="No customers found." currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                <Column header="Agent" sortable sortField="representative.name" filterField="representative" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }}
                    body={representativeBodyTemplate} filter filterElement={representativeFilterTemplate} />
                <Column header="Add Text" field="addText" body={addTextBody} style={{ minWidth: '14rem' }} />
                <Column header="QTY" field="qty" style={{ minWidth: '14rem' }} />
                <Column header="Discount" field="discount" body={discountBody} style={{ minWidth: '14rem' }} />
                <Column field="balance" header="Balance" sortable dataType="numeric" style={{ minWidth: '12rem' }} body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate} />
                <Column header="Amount" field="amount" body={amountBody} style={{ minWidth: '14rem' }} />
                {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column> */}
                {/* <Column field="name" header="Name" sortable filter filterPlaceholder="Search by name" style={{ minWidth: '14rem' }} /> */}
                {/* <Column field="country.name" header="Country" sortable filterField="country.name" style={{ minWidth: '14rem' }} body={countryBodyTemplate} filter filterPlaceholder="Search by country" /> */}
                {/* <Column field="date" header="Date" sortable filterField="date" dataType="date" style={{ minWidth: '12rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} /> */}
                {/* <Column field="status" header="Status" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} /> */}
                {/* <Column field="activity" header="Activity" sortable showFilterMatchModes={false} style={{ minWidth: '12rem' }} body={activityBodyTemplate} filter filterElement={activityFilterTemplate} /> */}
                <Column headerStyle={{ width: '8rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
            </DataTable>
        </div>
    )
}

export default AllProductsTable
