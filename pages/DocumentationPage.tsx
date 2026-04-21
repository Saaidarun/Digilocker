
import React from 'react';
import { BookOpen, Code, Database, Layout, Shield, Zap } from 'lucide-react';

const DocumentationPage: React.FC = () => {
  const sections = [
    {
      title: "Abstract",
      content: "DigiLocker Secure is a robust document management system designed to provide users with a secure digital vault for their sensitive documents. The system follows a centralized architecture that allows for efficient storage, categorization, and administrative oversight.",
      icon: BookOpen
    },
    {
      title: "Problem Statement",
      content: "Modern digital ecosystems require a centralized, secure repository for documents that balances user privacy with administrative accountability. Traditional file storage often lacks structured role-based access control and systematic document verification workflows.",
      icon: Code
    },
    {
      title: "System Analysis",
      content: "The system is built as a Single Page Application (SPA) utilizing React for the frontend and a simulated persistent storage layer. It employs role-based authentication to separate User and Admin functionalities. Security is maintained through state encapsulation and strictly defined API interactions.",
      icon: Zap
    },
    {
      title: "Database Design (ER Diagram)",
      content: "The system utilizes a relational data model with three primary entities: Users (storing credentials and roles), Documents (storing file metadata, ownership, and status), and Activity Logs (providing a tamper-evident audit trail of system interactions).",
      icon: Database
    },
    {
      title: "Security Requirements",
      content: "The system implements several security layers: Role-based access control (RBAC), Session-based lifecycle management, File type sanitization, and Audit logging for all critical operations including uploads and deletions.",
      icon: Shield
    },
    {
      title: "Future Enhancements",
      content: "Future versions will integrate end-to-end encryption using WebCrypto API, Blockchain-based document integrity verification, AI-powered document categorization, and full collaborative editing capabilities.",
      icon: Layout
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Project Documentation</h1>
        <p className="text-xl text-gray-500">Secure Document Management System (SDMS)</p>
        <div className="mt-8 flex justify-center space-x-4">
          <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold">Version 1.0.0</span>
          <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold">Stable Release</span>
        </div>
      </header>

      <div className="space-y-12">
        {sections.map((section, idx) => (
          <section key={idx} className="relative pl-12">
            <div className="absolute left-0 top-0 bg-white border border-gray-200 p-2 rounded-xl shadow-sm text-blue-600">
              <section.icon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-gray-600 leading-relaxed prose prose-blue">
              {section.content}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-20 pt-10 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>&copy; 2024 DigiLocker Secure. Developed as a high-fidelity React implementation of a document management vault.</p>
      </footer>
    </div>
  );
};

export default DocumentationPage;
