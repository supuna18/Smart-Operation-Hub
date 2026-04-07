package smart_op_hub.CampusHub.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smart_op_hub.CampusHub.model.Resource;
import smart_op_hub.CampusHub.repository.ResourceRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {
    private final ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Optional<Resource> getResourceById(String id) {
        return resourceRepository.findById(id);
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(String id, Resource resourceDetails) {
        return resourceRepository.findById(id).map(resource -> {
            resource.setName(resourceDetails.getName());
            resource.setType(resourceDetails.getType());
            resource.setCapacity(resourceDetails.getCapacity());
            resource.setQuantity(resourceDetails.getQuantity());
            resource.setLocation(resourceDetails.getLocation());
            resource.setStatus(resourceDetails.getStatus());
            return resourceRepository.save(resource);
        }).orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
    }

    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }

    public List<Resource> searchResources(String name, String type, String status) {
        List<Resource> resources = resourceRepository.findAll();

        if (name != null && !name.isEmpty()) {
            resources = resources.stream()
                    .filter(r -> r.getName().toLowerCase().contains(name.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (type != null && !type.isEmpty()) {
            resources = resources.stream()
                    .filter(r -> r.getType().equalsIgnoreCase(type))
                    .collect(Collectors.toList());
        }

        if (status != null) {
            resources = resources.stream()
                    .filter(r -> r.getStatus() != null && r.getStatus().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        return resources;
    }
}
