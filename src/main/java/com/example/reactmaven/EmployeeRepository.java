package com.example.reactmaven;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;

@PreAuthorize("hasRole('ROLE_MANAGER')")
public interface EmployeeRepository 
extends PagingAndSortingRepository<Employee, Long> {
    
    @Override    
    @PreAuthorize("#employee?.manager?.name == authentication?.name")
    <S extends Employee> S save(@Param("employee") S employee);

    @Override
    @PreAuthorize("@employeeRepository.findById(#id)?.manager?.name == authentication?.name")
    void deleteById(@Param("id") Long id);

    @Override
    @PreAuthorize("#employee?.manager?.name == authentication?.name")
    void delete(@Param("employee") Employee employee);
}
