import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { t } from '../lib/i18n';

export function PatientInfo() {
  const [patientName, setPatientName] = useState('');
  const [healthInsurance, setHealthInsurance] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">{t('doctor.patientInfo')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="patient-name" className="text-sm font-medium">
              {t('doctor.patientName')}
            </label>
            <Input
              id="patient-name"
              placeholder={`${t('doctor.patientName')}...`}
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="health-insurance" className="text-sm font-medium">
              {t('doctor.healthInsurance')}
            </label>
            <Input
              id="health-insurance"
              placeholder={`${t('doctor.healthInsurance')}...`}
              value={healthInsurance}
              onChange={(e) => setHealthInsurance(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="appointment-type" className="text-sm font-medium">
            {t('doctor.appointmentType')}
          </label>
          <Input
            id="appointment-type"
            placeholder={`${t('doctor.appointmentType')}...`}
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
