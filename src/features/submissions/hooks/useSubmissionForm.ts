import { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getTemplateById, getSubmissionById, saveDraft, submitForm } from '../api/submissions';
import type { FormTemplate } from '../types';

export const useSubmissionForm = (id?: string, isEdit = false) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [template, setTemplate] = useState<FormTemplate | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                if (isEdit) {
                    const submissionData = await getSubmissionById(id);
                    const templateData = await getTemplateById(submissionData.templateId);
                    setTemplate(templateData);

                    const initialValues: Record<string, any> = {};
                    submissionData.submissionValues.forEach((sv: any) => {
                        initialValues[sv.fieldId] = sv.value;
                    });
                    form.setFieldsValue(initialValues);
                } else {
                    const data = await getTemplateById(id);
                    setTemplate(data);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                message.error(isEdit ? 'Failed to load application data.' : 'Failed to load form template.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEdit, form]);

    const handleSave = async () => {
        if (!template) {
            message.error('Missing required information to save draft.');
            return;
        }

        setSaving(true);
        try {
            const values = form.getFieldsValue();
            const draftData = {
                ...(isEdit && { id: Number(id) }),
                templateId: Number(template.id),
                values
            };

            await saveDraft(draftData);
            message.success('Draft saved successfully!');
            navigate('/');
        } catch (error: any) {
            console.error('Save Draft failed:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to save draft.';
            message.error(`Save failed: ${errorMsg}`);
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async () => {
        if (!template) {
            message.error('Missing required information to submit form.');
            return;
        }

        try {
            const values = await form.validateFields();
            setSubmitting(true);
            const submissionData = {
                ...(isEdit && { id: Number(id) }),
                templateId: Number(template.id),
                values
            };

            await submitForm(submissionData);
            message.success('Form submitted successfully!');
            navigate('/');
        } catch (error: any) {
            if (error.errorFields) return;
            console.error('Submission failed:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to submit form.';
            message.error(`Submission failed: ${errorMsg}`);
        } finally {
            setSubmitting(false);
        }
    };

    return {
        form,
        template,
        loading,
        saving,
        submitting,
        handleSave,
        handleSubmit,
        navigate
    };
};
